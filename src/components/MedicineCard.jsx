import React, { useMemo } from "react";
import { Check } from "lucide-react";
import "./MedicineCard.css";

/**
 * MedicineCard
 * - entry: { date: "YYYY-MM-DD", taken: boolean }
 * - isToday: boolean => sólo si true el check es interactivo
 * - onToggle(date) => callback para alternar taken (sólo si isToday)
 */
export default function MedicineCard({ entry, isToday, onToggle }) {
  // parseo seguro de la fecha (inicio del día en zona local)
  const startOfEntryDay = useMemo(
    () => new Date(`${entry.date}T00:00:00`),
    [entry.date]
  );
  const now = useMemo(() => new Date(), []);

  // status lógico:
  // - si es hoy => "taken" | "pending"
  // - si está en el futuro => "upcoming"
  // - si está en el pasado => "taken" | "ignored"
  const status = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (entry.date === todayStr) {
      return entry.taken ? "taken" : "pending"; // hoy todavía se puede marcar
    }

    if (startOfEntryDay > now) return "upcoming"; // días futuros

    // días pasados
    return entry.taken ? "taken" : "ignored"; // si no se tomó, se marca como ignorada
  }, [entry.date, entry.taken, startOfEntryDay, now]);

  // calcula el tiempo restante hasta el inicio del día (para "upcoming")
  const timeLeftText = useMemo(() => {
    const ms = startOfEntryDay - now;
    if (ms <= 0) return "";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `En ${days}d ${hours % 24}h`;
    }
    return `Faltan ${hours}h ${minutes}m`;
  }, [startOfEntryDay, now]);

  // handler click en el check (solo interactúa si isToday y no es 'upcoming')
  const handleToggle = () => {
    if (!isToday) return;
    if (status === "upcoming" || status === "past" || status === "ignored") return;
    onToggle && onToggle(entry.date);
  };

  // estilos de la pill de estado
  const statusPill = {
    taken: "bg-green-600 text-white",
    pending: "bg-red-500 text-white",
    ignored: "bg-red-500 text-white", // igual que pending pero ya no se puede marcar
    upcoming: "bg-white text-gray-800 border border-gray-200",
    past: "bg-gray-200 text-gray-700",
  }[status];

  // formato bonito de la fecha: ej "Mié, 17 Sep"
  const dateLabel = useMemo(() => {
    const d = new Date(`${entry.date}T00:00:00`);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }, [entry.date]);

  return (
    <div
      // fondo aguamarina, esquinas redondeadas, separacion entre días
      className="bg-teal-100 rounded-lg p-4 mb-4 flex items-center gap-4 shadow-sm"
    >
      {/* Fecha a la izquierda (fija ancho para que no pegue al borde) */}
      <div className="w-32 flex-shrink-0 flex flex-col">
        <span className="text-sm font-semibold text-teal-800">{dateLabel}</span>
        <span className="text-xs text-teal-700">{entry.date}</span>
      </div>

      {/* Contenido central (puede ampliarse: nombre dosis etc.) */}
      <div className="flex-1 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-teal-900">Medicamento</div>
          <div className="text-xs text-teal-700">1 comprimido · mañana</div>
        </div>

        {/* Pill de estado o contador (espaciado interno y border si es white) */}
        <div className="ml-4">
          {status === "taken" && (
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusPill}`}
            >
              Tomada
            </span>
          )}
          {status === "pending" && (
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusPill}`}
            >
              Pendiente
            </span>
          )}
          {status === "ignored" && (
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusPill}`}
            >
              Ignorada
            </span>
          )}
          {status === "upcoming" && (
            <span
              className={`px-3 py-1 rounded-full font-medium text-[13px] ${statusPill} whitespace-nowrap`}
              title={timeLeftText}
            >
              {timeLeftText}
            </span>
          )}
          {status === "past" && (
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusPill}`}
            >
              Archivado
            </span>
          )}
        </div>
      </div>

      {/* Checkmark a la derecha */}
      <button
        aria-label={status === "taken" ? "Desmarcar tomado" : "Marcar tomado"}
        onClick={handleToggle}
        disabled={!isToday || status === "upcoming" || status === "past" || status === "ignored"}
        className={`ml-4 p-2 rounded-full border transition ${
          !isToday || status === "upcoming" || status === "past" || status === "ignored"
            ? "opacity-40 cursor-not-allowed border-gray-200"
            : "hover:bg-green-50 border-gray-300"
        }`}
      >
        <Check
          className={`w-5 h-5 ${
            status === "taken" ? "text-green-600" : "text-gray-500"
          }`}
        />
      </button>
    </div>
  );
}
