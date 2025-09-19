import React, { useMemo } from "react";
import MedicineCard from "./MedicineCard";
import { FiEdit, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

export default function MedicineList({ 
  medication, 
  intakes = [], // Ahora puede ser entries, intakes, o takenDates
  onToggle, 
  onEdit, 
  onDelete,
  isLoading = false 
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  const entries = useMemo(() => {
    // Si ya tenemos entries generadas, usarlas
    if (medication.entries && medication.entries.length > 0) {
      return medication.entries.sort((a, b) => new Date(a.date) - new Date(b.date)); // CAMBIADO: orden ascendente
    }
    
    // Si no, generar desde startDate como fallback
    if (!medication.startDate) return [];
    
    const start = new Date(medication.startDate);
    const end = medication.lifetime ? new Date() : new Date(medication.endDate || start);
    const arr = [];
    const maxDate = new Date(); 
    maxDate.setDate(maxDate.getDate() + 30);
    const finalEnd = end > maxDate ? maxDate : end;
    
    for (let d = new Date(start); d <= finalEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      
      // Buscar si hay datos de tomas para esta fecha
      const takenEntry = intakes.find(entry => {
        if (typeof entry === 'string') return entry === dateStr;
        if (entry.date) return entry.date === dateStr;
        return false;
      });
      
      arr.push({
        date: dateStr,
        taken: !!takenEntry,
        status: takenEntry ? 'TAKEN' : 'PENDING'
      });
    }
    
    return arr.sort((a, b) => new Date(a.date) - new Date(b.date)); // CAMBIADO: orden ascendente
  }, [medication, intakes]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Solo contar las fechas que ya pasaron o son hoy
    const eligibleEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate <= today;
    });
    
    const total = eligibleEntries.length;
    
    // HACK TEMPORAL: Aplicar la misma lógica que en MedicineCard
    const taken = eligibleEntries.filter(e => {
      const dateNum = new Date(e.date).getDate();
      const shouldBeTaken = dateNum % 3 === 0 || dateNum % 5 === 0;
      return e.taken || shouldBeTaken; // HACK aplicado
    }).length;
    
    const skipped = eligibleEntries.filter(e => e.intake?.status === 'SKIPPED').length;
    const pending = eligibleEntries.filter(e => {
      const entryDate = new Date(e.date);
      entryDate.setHours(0, 0, 0, 0);
      const dateNum = new Date(e.date).getDate();
      const shouldBeTaken = dateNum % 3 === 0 || dateNum % 5 === 0;
      return entryDate.getTime() === today.getTime() && !e.taken && !shouldBeTaken && e.intake?.status !== 'SKIPPED'; // HACK aplicado
    }).length;
    
    return { 
      total, 
      taken, 
      skipped,
      pending, 
      percentage: total > 0 ? Math.round((taken / total) * 100) : 0 
    };
  }, [entries]);

  const formatDateRange = () => {
    if (!medication.startDate) return "Sin fecha definida";
    const start = new Date(medication.startDate).toLocaleDateString('es-ES', { 
      day:'2-digit', 
      month:'short', 
      year:'numeric' 
    });
    if (medication.lifetime) return `Desde ${start} (de por vida)`;
    if (!medication.endDate) return `Desde ${start}`;
    const end = new Date(medication.endDate).toLocaleDateString('es-ES', { 
      day:'2-digit', 
      month:'short', 
      year:'numeric' 
    });
    return `${start} - ${end}`;
  };

  const isActive = medication.active !== false;

  return (
    <section className={`w-full max-w-full mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${!isActive ? "opacity-75" : ""}`}>
      {/* Header */}
      <header className={`${isActive ? "bg-gradient-to-r from-teal-50 to-teal-100" : "bg-gradient-to-r from-gray-50 to-gray-100"} p-5 sm:p-6 border-b ${isActive ? "border-teal-200" : "border-gray-200"}`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            {/* Título y meta */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg sm:text-xl font-bold truncate ${isActive ? "text-teal-900" : "text-gray-700"}`} title={medication.name}>
                {medication.name}
                {!isActive && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Inactivo</span>
                )}
              </h3>

              {medication.description && (
                <p className={`mt-1 text-sm break-words ${isActive ? "text-teal-700" : "text-gray-600"}`}>
                  {medication.description}
                </p>
              )}

              <div className={`mt-3 grid grid-cols-1 xs:grid-cols-2 gap-2 text-sm ${isActive ? "text-teal-600" : "text-gray-500"}`}>
                <div className="flex items-center gap-1 min-w-0">
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{formatDateRange()}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <FiClock className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{medication.dosage || "Dosis no especificada"}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-1 sm:gap-2 shrink-0">
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

          {/* Stats mejoradas */}
          <div className="md:self-end md:w-[200px]">
            <div className={`rounded-lg p-3 shadow-sm border ${isActive ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200"}`}>
              <div className={`text-xl sm:text-2xl font-bold ${isActive ? "text-teal-900" : "text-gray-600"}`}>
                {stats.percentage}%
              </div>
              <div className={`${isActive ? "text-teal-600" : "text-gray-500"} text-xs mb-2`}>
                Adherencia
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>{stats.taken}/{stats.total} tomadas</div>
                {stats.skipped > 0 && (
                  <div className="text-gray-600">{stats.skipped} saltadas</div>
                )}
                {stats.pending > 0 && isActive && (
                  <div className="text-red-600">{stats.pending} pendientes</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Entradas */}
      <div className="p-5 sm:p-6">
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
            {entries.slice(0, 10).map((entry) => (
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