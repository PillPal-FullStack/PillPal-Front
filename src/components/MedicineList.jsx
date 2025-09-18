import React, { useMemo } from "react";
import MedicineCard from "./MedicineCard";
import { FiEdit, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

export default function MedicineList({ 
  medication, 
  takenDates = [], 
  onToggle, 
  onEdit, 
  onDelete,
  isLoading = false 
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Generar entradas diarias entre startDate y endDate
  const entries = useMemo(() => {
    if (!medication.startDate) return [];
    
    const start = new Date(medication.startDate);
    const end = medication.lifetime ? new Date() : new Date(medication.endDate || start);
    const arr = [];
    
    // Limitar a 30 días hacia adelante para evitar demasiadas entradas
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const finalEnd = end > maxDate ? maxDate : end;
    
    for (let d = new Date(start); d <= finalEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      arr.push({
        date: dateStr,
        taken: takenDates.some(takenDate => 
          typeof takenDate === 'string' ? takenDate === dateStr : takenDate.date === dateStr
        ),
      });
    }
    
    return arr.sort((a, b) => new Date(b.date) - new Date(a.date)); // Más recientes primero
  }, [medication.startDate, medication.endDate, medication.lifetime, takenDates]);

  const stats = useMemo(() => {
    const total = entries.length;
    const taken = entries.filter(entry => entry.taken).length;
    const pending = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const today = new Date();
      return !entry.taken && entryDate <= today;
    }).length;
    
    return { total, taken, pending, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  }, [entries]);

  const formatDateRange = () => {
    if (!medication.startDate) return "Sin fecha definida";
    
    const start = new Date(medication.startDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    if (medication.lifetime) {
      return `Desde ${start} (de por vida)`;
    }
    
    if (!medication.endDate) {
      return `Desde ${start}`;
    }
    
    const end = new Date(medication.endDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  };

  const isActive = medication.active !== false; // Por defecto true si no está definido

  return (
    <section className={`mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
      !isActive ? 'opacity-75' : ''
    }`}>
      {/* Header */}
      <header className={`${
        isActive 
          ? 'bg-gradient-to-r from-teal-50 to-teal-100' 
          : 'bg-gradient-to-r from-gray-50 to-gray-100'
      } p-6 border-b ${
        isActive ? 'border-teal-200' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-xl font-bold ${
                isActive ? 'text-teal-900' : 'text-gray-700'
              }`}>
                {medication.name}
                {!isActive && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Inactivo
                  </span>
                )}
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => onEdit && onEdit(medication.id)} 
                  className="p-2 rounded-lg hover:bg-teal-200 transition-colors" 
                  title="Editar medicamento"
                  disabled={isLoading}
                >
                  <FiEdit className="w-4 h-4 text-teal-700" />
                </button>
                <button 
                  onClick={() => onDelete && onDelete(medication.id)} 
                  className="p-2 rounded-lg hover:bg-red-100 transition-colors" 
                  title="Eliminar medicamento"
                  disabled={isLoading}
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            {medication.description && (
              <p className={`text-sm mb-3 ${
                isActive ? 'text-teal-700' : 'text-gray-600'
              }`}>
                {medication.description}
              </p>
            )}
            
            <div className={`flex flex-wrap gap-4 text-sm ${
              isActive ? 'text-teal-600' : 'text-gray-500'
            }`}>
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDateRange()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{medication.dosage || 'Dosis no especificada'}</span>
              </div>
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="ml-6 text-right">
            <div className={`${
              isActive ? 'bg-white' : 'bg-gray-50 border-gray-200'
            } rounded-lg p-3 shadow-sm border`}>
              <div className={`text-2xl font-bold ${
                isActive ? 'text-teal-900' : 'text-gray-600'
              }`}>
                {stats.percentage}%
              </div>
              <div className={`text-xs ${
                isActive ? 'text-teal-600' : 'text-gray-500'
              }`}>
                Adherencia
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.taken}/{stats.total} tomadas
              </div>
              {stats.pending > 0 && isActive && (
                <div className="text-xs text-red-600 mt-1">
                  {stats.pending} pendientes
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Lista de entradas */}
      <div className="p-6">
        {!isActive ? (
          <div className="text-center py-8 text-gray-500">
            <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Este medicamento está inactivo</p>
            <p className="text-xs mt-1">No se mostrarán nuevas entradas</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay entradas programadas para este medicamento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 10).map((entry) => ( // Mostrar solo los primeros 10 para rendimiento
              <MedicineCard
                key={entry.date}
                entry={entry}
                medication={medication}
                isToday={entry.date === todayStr}
                onToggle={(date) => onToggle(medication.id, date)}
                isLoading={isLoading}
              />
            ))}
            {entries.length > 10 && (
              <div className="text-center py-4">
                <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                  Ver más entradas ({entries.length - 10} restantes)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}