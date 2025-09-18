import React, { useState, useEffect, useCallback } from "react";
import MedicineLists from "../components/MedicineLists";
import { 
  getMedications, 
  getMedicationsStatus, 
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
  
  // Token temporal - en producción debería venir de un contexto de autenticación
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6IltST0xFX1VTRVJdIiwic3ViIjoidGVzdHVzZXIiLCJpYXQiOjE3NTgyMDU0MzksImV4cCI6MTc1ODIwNzIzOX0.K1KYL17_UqkvhCYYPLm6FLQ1VS_Apvah2wY3DCO4Mpc";

  // Filtrar medicamentos según el estado activo/inactivo
  const filteredMedications = medications.filter(med => 
    showInactive ? true : med.active !== false
  );

  // Cargar medicamentos desde la API
  const loadMedications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Cargar medicamentos básicos
      const medicationsData = await getMedications();
      
      // Cargar estado/historial de cada medicamento
      const medicationsWithStatus = await Promise.all(
        medicationsData.map(async (med) => {
          try {
            // Si tienes un endpoint específico para obtener el historial de tomas
            
            // Por ahora usamos el endpoint de status general
            const statusData = await getMedicationsStatus();
            const medStatus = statusData.find(status => status.id === med.id);
            
            return {
              ...med,
              takenDates: medStatus?.todayIntakes || []
            };
          } catch (err) {
            console.warn(`Error cargando estado del medicamento ${med.id}:`, err);
            return {
              ...med,
              takenDates: []
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
  }, []);

  // Efecto inicial para cargar datos
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  // Manejar toggle de toma de medicamento
  const handleToggle = useCallback(async (medicationId, date) => {
    const loadingKey = `${medicationId}-${date}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      // Encontrar el medicamento y la entrada específica
      const medication = medications.find(m => m.id.toString() === medicationId.toString());
      if (!medication) throw new Error("Medicamento no encontrado");
      
      const isTaken = medication.takenDates.some(takenDate => 
        typeof takenDate === 'string' ? takenDate === date : takenDate.date === date
      );
      
      // Llamar al endpoint correspondiente
      if (isTaken) {
        await markSkipped(medicationId);
      } else {
        await markTaken(medicationId);
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
      
      // Mostrar feedback exitoso (opcional)
      console.log(`Medicamento ${isTaken ? 'desmarcado' : 'marcado'} correctamente`);
      
    } catch (err) {
      console.error("Error actualizando medicamento:", err);
      setError("Error al actualizar el medicamento. Inténtalo de nuevo.");
      
      // Limpiar error después de unos segundos
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[loadingKey];
        return newState;
      });
    }
  }, [medications]);

  // Manejar edición de medicamento
  const handleEdit = useCallback((medicationId) => {
    navigate(`/edit/${medicationId}`);
  }, [navigate]);

  // Manejar eliminación de medicamento
  const handleDelete = useCallback(async (medicationId) => {
  if (!window.confirm("¿Estás seguro de que quieres eliminar este medicamento?")) return;

  try {
-   // antes quitabas solo del estado
-   setMedications(prev => prev.filter(m => m.id.toString() !== medicationId.toString()));
-   console.log("Medicamento eliminado:", medicationId);

+   await forceDeleteMedication(medicationId); // borra reminders -> medicamento
+   await loadMedications(); // confirma contra el backend
+   console.log("Medicamento eliminado en backend:", medicationId);
  } catch (err) {
    console.error("Error eliminando medicamento:", err);
    setError(err.message || "Error al eliminar el medicamento");
    setTimeout(() => setError(null), 5000);
  }
}, [loadMedications]);

  // Manejar adición de nuevo medicamento
 const handleAddNew = useCallback(() => {
   navigate("/create"); // ← abre la página Create (con CreateForm dentro)
 }, [navigate]);

  // Manejar actualización manual
  const handleRefresh = useCallback(() => {
    loadMedications();
  }, [loadMedications]);

  // Determinar si hay alguna acción en curso
  const isAnyActionLoading = Object.keys(actionLoading).length > 0;

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
                onChange={(e) => setShowInactive(e.target.checked)}
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
          onRefresh={handleRefresh}
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