import { useState, useCallback, useEffect } from 'react';
import { 
  getMedications, 
  getMedicationIntakes,
  markTaken, 
  markSkipped 
} from '../services/CardService';

export function useMedications() {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Función para convertir los intakes del backend a nuestro formato
  const processIntakes = (intakes) => {
    // Agrupar intakes por fecha
    const intakesByDate = {};
    
    intakes.forEach(intake => {
      const date = new Date(intake.dateTime).toISOString().split('T')[0];
      if (!intakesByDate[date]) {
        intakesByDate[date] = [];
      }
      intakesByDate[date].push(intake);
    });
    
    // Crear un resumen por fecha
    return Object.keys(intakesByDate).map(date => {
      const dayIntakes = intakesByDate[date];
      const takenCount = dayIntakes.filter(intake => intake.status === 'TAKEN').length;
      const totalCount = dayIntakes.length;
      const hasSkipped = dayIntakes.some(intake => intake.status === 'SKIPPED');
      const hasPending = dayIntakes.some(intake => intake.status === 'PENDING');
      
      // Determinar el estado general del día
      let status = 'PENDING';
      if (takenCount === totalCount) {
        status = 'TAKEN'; // Todas las dosis tomadas
      } else if (takenCount > 0) {
        status = 'PARTIAL'; // Algunas dosis tomadas
      } else if (hasSkipped) {
        status = 'SKIPPED'; // Todas saltadas o alguna saltada
      }
      
      return {
        date,
        status,
        intakes: dayIntakes, // Mantener todos los intakes del día
        taken: status === 'TAKEN' || status === 'PARTIAL',
        totalIntakes: totalCount,
        takenIntakes: takenCount
      };
    });
  };

  // Cargar medicamentos desde la API
  const loadMedications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Cargando medicamentos...');
      const medicationsData = await getMedications();
      console.log('Medicamentos recibidos:', medicationsData);
      
      // Cargar intakes de cada medicamento
      const medicationsWithIntakes = await Promise.all(
        medicationsData.map(async (med) => {
          try {
            const intakes = await getMedicationIntakes(med.id);
            const processedIntakes = processIntakes(intakes || []);
            
            return {
              ...med,
              intakes: processedIntakes,
              // Para compatibilidad con código existente
              takenDates: processedIntakes.filter(intake => intake.taken)
            };
          } catch (err) {
            console.warn(`Error cargando intakes del medicamento ${med.id}:`, err);
            return {
              ...med,
              intakes: [],
              takenDates: []
            };
          }
        })
      );
      
      setMedications(medicationsWithIntakes);
    } catch (err) {
      console.error("Error cargando medicamentos:", err);
      setError(err.message || "Error al cargar los medicamentos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle estado de medicamento
  const toggleMedication = useCallback(async (medicationId, date) => {
    const loadingKey = `${medicationId}-${date}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      const medication = medications.find(m => m.id.toString() === medicationId.toString());
      if (!medication) throw new Error("Medicamento no encontrado");
      
      // Buscar el resumen del día para esta fecha
      const dayIntake = medication.intakes?.find(intake => intake.date === date);
      
      if (dayIntake) {
        // Si ya existe un resumen para este día, toggle basado en su estado actual
        if (dayIntake.status === 'TAKEN') {
          // Si está completamente tomado, marcar como saltado
          await markSkipped(medicationId, date);
        } else {
          // Si está pendiente, parcial o saltado, marcar como tomado
          await markTaken(medicationId, date);
        }
      } else {
        // Si no existe intake para este día, crear uno como tomado
        await markTaken(medicationId, date);
      }
      
      // Actualizar estado local
      setMedications(prev => 
        prev.map(med => {
          if (med.id.toString() !== medicationId.toString()) return med;
          
          // Actualizar o crear el intake para esta fecha
          const updatedIntakes = med.intakes ? [...med.intakes] : [];
          const intakeIndex = updatedIntakes.findIndex(intake => intake.date === date);
          
          const currentIntake = updatedIntakes[intakeIndex];
          let newStatus;
          
          if (currentIntake) {
            // Toggle del estado existente
            newStatus = currentIntake.status === 'TAKEN' ? 'SKIPPED' : 'TAKEN';
            updatedIntakes[intakeIndex] = {
              ...currentIntake,
              status: newStatus,
              taken: newStatus === 'TAKEN' || newStatus === 'PARTIAL'
            };
          } else {
            // Crear nuevo intake como tomado
            newStatus = 'TAKEN';
            updatedIntakes.push({
              date,
              status: newStatus,
              taken: true,
              intakes: [], // Se llenará con la respuesta del servidor
              totalIntakes: 1,
              takenIntakes: 1
            });
          }
          
          return {
            ...med,
            intakes: updatedIntakes,
            takenDates: updatedIntakes.filter(intake => intake.taken)
          };
        })
      );
      
    } catch (err) {
      console.error("Error actualizando medicamento:", err);
      setError("Error al actualizar el medicamento. Inténtalo de nuevo.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[loadingKey];
        return newState;
      });
    }
  }, [medications]);

  // Eliminar medicamento
  const deleteMedication = useCallback(async (medicationId) => {
    try {
      // TODO: Implementar endpoint de eliminación cuando esté disponible
      // await deleteMedicationAPI(medicationId);
      
      setMedications(prev => prev.filter(med => med.id.toString() !== medicationId.toString()));
    } catch (err) {
      console.error("Error eliminando medicamento:", err);
      setError("Error al eliminar el medicamento");
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  // Función para obtener el estado de un medicamento en una fecha específica
  const getMedicationStatusForDate = useCallback((medicationId, date) => {
    const medication = medications.find(m => m.id.toString() === medicationId.toString());
    if (!medication) return 'pending';
    
    const intake = medication.intakes?.find(intake => intake.date === date);
    if (!intake) {
      // Si no hay intake para esta fecha, verificar si está en el rango del medicamento
      const startDate = new Date(medication.startDate);
      const endDate = medication.endDate ? new Date(medication.endDate) : null;
      const checkDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      if (checkDate < startDate) return 'upcoming';
      if (endDate && checkDate > endDate) return 'expired';
      if (checkDate < today) return 'ignored';
      if (checkDate.getTime() === today.getTime()) return 'pending';
      if (checkDate > today) return 'upcoming';
      
      return 'pending';
    }
    
    return intake.status.toLowerCase();
  }, [medications]);

  // Cargar medicamentos al montar el hook
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  // Refresh manual
  const refresh = useCallback(() => {
    loadMedications();
  }, [loadMedications]);

  // Limpiar error manualmente
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    medications,
    isLoading,
    error,
    isAnyActionLoading: Object.keys(actionLoading).length > 0,
    toggleMedication,
    deleteMedication,
    getMedicationStatusForDate,
    refresh,
    clearError
  };
}