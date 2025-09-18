import { useState, useCallback, useEffect } from 'react';
import { 
  getMedications, 
  getMedicationsStatus, 
  markTaken, 
  markSkipped 
} from '../services/CardService';

export function useMedications(token) {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Cargar medicamentos desde la API
  const loadMedications = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Cargando medicamentos...');
      const medicationsData = await getMedications(token);
      console.log('Medicamentos recibidos:', medicationsData);
      
      // Cargar estado/historial de cada medicamento
      const medicationsWithStatus = await Promise.all(
        medicationsData.map(async (med) => {
          try {
            const statusData = await getMedicationsStatus(token);
            const medStatus = statusData.find(status => status.id === med.id);
            
            return {
              ...med,
              takenDates: medStatus?.takenDates || []
              // Los campos ya vienen con los nombres correctos de la API
            };
          } catch (err) {
            console.warn(`Error cargando estado del medicamento ${med.id}:`, err);
            return {
              ...med,
              takenDates: []
              // Los campos ya vienen con los nombres correctos de la API
            };
          }
        })
      );
      
      setMedications(medicationsWithStatus);
    } catch (err) {
      console.error("Error cargando medicamentos:", err);
      setError(err.message || "Error al cargar los medicamentos");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Toggle estado de medicamento
  const toggleMedication = useCallback(async (medicationId, date) => {
    const loadingKey = `${medicationId}-${date}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      const medication = medications.find(m => m.id.toString() === medicationId.toString());
      if (!medication) throw new Error("Medicamento no encontrado");
      
      const isTaken = medication.takenDates.some(takenDate => 
        typeof takenDate === 'string' ? takenDate === date : takenDate.date === date
      );
      
      if (isTaken) {
        await markSkipped(medicationId, token);
      } else {
        await markTaken(medicationId, token);
      }
      
      // Actualizar estado local
      setMedications(prev => 
        prev.map(med => {
          if (med.id.toString() !== medicationId.toString()) return med;
          
          const newTakenDates = isTaken 
            ? med.takenDates.filter(takenDate => 
                typeof takenDate === 'string' ? takenDate !== date : takenDate.date !== date
              )
            : [...med.takenDates, { date, taken: true, timestamp: new Date().toISOString() }];
          
          return {
            ...med,
            takenDates: newTakenDates
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
  }, [medications, token]);

  // Eliminar medicamento
  const deleteMedication = useCallback(async (medicationId) => {
    try {
      // TODO: Implementar endpoint de eliminación cuando esté disponible
      // await deleteMedicationAPI(medicationId, token);
      
      setMedications(prev => prev.filter(med => med.id.toString() !== medicationId.toString()));
    } catch (err) {
      console.error("Error eliminando medicamento:", err);
      setError("Error al eliminar el medicamento");
      setTimeout(() => setError(null), 5000);
    }
  }, [token]);

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
    refresh,
    clearError
  };
}