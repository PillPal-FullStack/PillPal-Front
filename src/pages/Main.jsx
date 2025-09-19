import React, { useState, useEffect, useCallback } from "react";
import MedicineLists from "../components/MedicineLists";
import { 
  getMedications, 
  markTaken, 
  markSkipped,
  forceDeleteMedication
} from "../services/CardService";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Filtrar medicamentos según el estado activo/inactivo
  const filteredMedications = medications.filter(med => 
    showInactive ? true : med.active !== false
  );

  // Función para crear entradas de fechas basadas en el medicamento
  const generateMedicationEntries = (medication) => {
    if (!medication.startDate) return [];
    
    const start = new Date(medication.startDate);
    const end = medication.lifetime ? new Date() : new Date(medication.endDate || start);
    const entries = [];
    const maxDate = new Date(); 
    maxDate.setDate(maxDate.getDate() + 30); // Mostrar hasta 30 días en el futuro
    const finalEnd = end > maxDate ? maxDate : end;
    
    for (let d = new Date(start); d <= finalEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      // Buscar si hay datos de tomas para esta fecha
      const takenEntry = medication.takenDates?.find(entry => 
        typeof entry === 'string' ? entry === dateStr : entry.date === dateStr
      );
      
      entries.push({
        date: dateStr,
        taken: !!takenEntry,
        status: takenEntry ? 'TAKEN' : 'PENDING'
      });
    }
    
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Cargar medicamentos desde la API
  const loadMedications = useCallback(async () => {
    console.log('🚀 INICIANDO CARGA DE MEDICAMENTOS...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Cargar medicamentos básicos
      console.log('📋 Cargando lista de medicamentos...');
      const medicationsData = await getMedications();
      console.log('📋 MEDICAMENTOS RECIBIDOS:', medicationsData);
      
      // Cargar estado de medicamentos (usando el endpoint que funciona)
      let statusData = [];
      try {
        console.log('📊 Cargando estados de medicamentos...');
        statusData = await getMedicationsStatus();
        console.log('📊 ESTADOS RECIBIDOS:', statusData);
      } catch (err) {
        console.warn('⚠️ Error cargando estados (continuando sin ellos):', err);
      }
      
      // Combinar medicamentos con sus estados
      const medicationsWithStatus = medicationsData.map(med => {
        const medStatus = statusData.find(status => status.id === med.id);
        const processedMed = {
          ...med,
          takenDates: medStatus?.todayIntakes || medStatus?.takenDates || []
        };
        
        // Generar entradas para este medicamento
        processedMed.entries = generateMedicationEntries(processedMed);
        
        console.log(`💊 MEDICAMENTO ${med.id} PROCESADO:`, processedMed);
        return processedMed;
      });
      
      console.log('✅ MEDICAMENTOS FINALES:', medicationsWithStatus);
      setMedications(medicationsWithStatus);
    } catch (err) {
      console.error("❌ ERROR CARGANDO MEDICAMENTOS:", err);
      setError(err.message || "Error al cargar los medicamentos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto inicial para cargar datos
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  // Manejar toggle de toma de medicamento
  const handleToggle = useCallback(async (medicationId, date) => {
    console.log('🎯 TOGGLE INICIADO:', { medicationId, date });
    
    const loadingKey = `${medicationId}-${date}`;
    setActionLoading(prev => {
      const newState = { ...prev, [loadingKey]: true };
      console.log('⏳ ACTIVANDO LOADING:', loadingKey, newState);
      return newState;
    });
    
    try {
      // Encontrar el medicamento
      const medication = medications.find(m => m.id.toString() === medicationId.toString());
      if (!medication) {
        console.error('❌ MEDICAMENTO NO ENCONTRADO:', medicationId);
        throw new Error("Medicamento no encontrado");
      }
      
      console.log('💊 MEDICAMENTO ENCONTRADO:', medication);
      
      // Determinar si ya está tomado para esta fecha
      const isTaken = medication.takenDates?.some(takenDate => 
        typeof takenDate === 'string' ? takenDate === date : takenDate.date === date
      );
      
      console.log('📅 ESTADO ACTUAL:', { date, isTaken });
      
      // Llamar al endpoint correspondiente
      let apiCall;
      if (isTaken) {
        console.log('🔄 MARCANDO COMO SALTADO');
        apiCall = markSkipped(medicationId);
      } else {
        console.log('🔄 MARCANDO COMO TOMADO');
        apiCall = markTaken(medicationId);
      }
      
      const result = await apiCall;
      console.log('✅ RESULTADO API CALL:', result);
      
      // Actualizar estado local inmediatamente
      setMedications(prev => 
        prev.map(med => {
          if (med.id.toString() !== medicationId.toString()) return med;
          
          const newTakenDates = isTaken 
            ? med.takenDates.filter(takenDate => 
                typeof takenDate === 'string' ? takenDate !== date : takenDate.date !== date
              )
            : [...(med.takenDates || []), { date, taken: true, timestamp: new Date().toISOString() }];
          
          const updatedMed = {
            ...med,
            takenDates: newTakenDates
          };
          
          // Regenerar entradas
          updatedMed.entries = generateMedicationEntries(updatedMed);
          
          console.log('🔄 MEDICAMENTO ACTUALIZADO:', updatedMed);
          return updatedMed;
        })
      );
      
      console.log('✅ TOGGLE COMPLETADO EXITOSAMENTE');
      
    } catch (err) {
      console.error("❌ ERROR EN TOGGLE:", err);
      setError("Error al actualizar el medicamento. Inténtalo de nuevo.");
      
      // Limpiar error después de unos segundos
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[loadingKey];
        console.log('⏳ DESACTIVANDO LOADING:', loadingKey, newState);
        return newState;
      });
    }
  }, [medications]);

  // Manejar edición de medicamento
  const handleEdit = useCallback((medicationId) => {
    console.log('✏️ EDITANDO MEDICAMENTO:', medicationId);
    navigate(`/edit/${medicationId}`);
  }, [navigate]);

  // Manejar eliminación de medicamento
  const handleDelete = useCallback(async (medicationId) => {
    console.log('🗑️ INTENTANDO ELIMINAR MEDICAMENTO:', medicationId);
    
    if (!window.confirm("¿Estás seguro de que quieres eliminar este medicamento?")) {
      console.log('❌ ELIMINACIÓN CANCELADA POR USUARIO');
      return;
    }

    try {
      console.log('🗑️ EJECUTANDO ELIMINACIÓN...');
      await forceDeleteMedication(medicationId);
      console.log('✅ ELIMINACIÓN EN BACKEND COMPLETADA');
      
      console.log('🔄 RECARGANDO MEDICAMENTOS DESPUÉS DE ELIMINAR...');
      await loadMedications();
      console.log('✅ MEDICAMENTO ELIMINADO COMPLETAMENTE:', medicationId);
    } catch (err) {
      console.error("❌ ERROR ELIMINANDO MEDICAMENTO:", err);
      setError(err.message || "Error al eliminar el medicamento");
      setTimeout(() => setError(null), 5000);
    }
  }, [loadMedications]);

  // Manejar adición de nuevo medicamento
  const handleAddNew = useCallback(() => {
    console.log('➕ NAVEGANDO A CREAR MEDICAMENTO');
    navigate("/create");
  }, [navigate]);

  // Determinar si hay alguna acción en curso
  const isAnyActionLoading = Object.keys(actionLoading).length > 0;
  console.log('⏳ ESTADO DE LOADING:', { isLoading, actionLoading, isAnyActionLoading });

  console.log('🎨 RENDERIZANDO MAIN COMPONENT:', { 
    medicationsCount: medications.length, 
    filteredCount: filteredMedications.length,
    showInactive,
    isLoading,
    error 
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Gestión de <span className="text-teal-600">Medicamentos</span>
          </h1>
          <p className="text-lg text-gray-600">
            Mantén un seguimiento completo de tus tratamientos médicos
          </p>
          
          {/* Toggle para mostrar inactivos */}
          <div className="mt-6 flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => {
                  console.log('🔘 CAMBIANDO MOSTRAR INACTIVOS:', e.target.checked);
                  setShowInactive(e.target.checked);
                }}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-600">
                Mostrar medicamentos inactivos 
                <span className="text-gray-400">
                  ({medications.filter(med => med.active === false).length})
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Componente de listas */}
        <MedicineLists 
          medications={filteredMedications}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
          isLoading={isLoading || isAnyActionLoading}
          error={error}
        />

        {/* Footer informativo */}
        {filteredMedications.length > 0 && (
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              Última actualización: {new Date().toLocaleString('es-ES')}
            </p>
            <p className="mt-1">
              Recuerda consultar siempre con tu médico sobre cualquier cambio en tu tratamiento
            </p>
          </div>
        )}
      </div>
    </main>
  );
}