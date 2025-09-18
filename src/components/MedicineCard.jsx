// import React, { useMemo } from "react";
// import { Check, Clock, Pill } from "lucide-react";

// export default function MedicineCard({ entry, medication, isToday, onToggle, isLoading = false }) {
//   const startOfEntryDay = useMemo(
//     () => new Date(`${entry.date}T00:00:00`),
//     [entry.date]
//   );
//   const now = useMemo(() => new Date(), []);

//   const status = useMemo(() => {
//     const todayStr = new Date().toISOString().split("T")[0];

//     if (entry.date === todayStr) {
//       return entry.taken ? "taken" : "pending";
//     }
//     if (startOfEntryDay > now) return "upcoming";

//     return entry.taken ? "taken" : "ignored";
//   }, [entry.date, entry.taken, startOfEntryDay, now]);

//   const timeLeftText = useMemo(() => {
//     const ms = startOfEntryDay - now;
//     if (ms <= 0) return "";
//     const totalMinutes = Math.floor(ms / 60000);
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;
//     if (hours >= 24) {
//       const days = Math.floor(hours / 24);
//       return `En ${days}d ${hours % 24}h`;
//     }
//     return `Faltan ${hours}h ${minutes}m`;
//   }, [startOfEntryDay, now]);

//   const handleToggle = () => {
//     if (!isToday || isLoading) return;
//     if (status === "upcoming" || status === "ignored") return;
//     onToggle && onToggle(entry.date);
//   };

//   const statusConfig = {
//     taken: {
//       pill: "bg-green-600 text-white",
//       text: "Tomada",
//       icon: <Check className="w-4 h-4" />
//     },
//     pending: {
//       pill: "bg-red-500 text-white",
//       text: "Pendiente",
//       icon: <Clock className="w-4 h-4" />
//     },
//     ignored: {
//       pill: "bg-red-500 text-white",
//       text: "Ignorada",
//       icon: null
//     },
//     upcoming: {
//       pill: "bg-white text-gray-800 border border-gray-200",
//       text: timeLeftText,
//       icon: <Clock className="w-4 h-4" />
//     }
//   };

//   const currentStatus = statusConfig[status];

//   const dateLabel = useMemo(() => {
//     const d = new Date(`${entry.date}T00:00:00`);
//     return d.toLocaleDateString('es-ES', {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//     });
//   }, [entry.date]);

//   return (
//     <div className={`bg-teal-100 rounded-lg p-4 mb-4 flex items-center gap-4 shadow-sm transition-all duration-200 ${
//       isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-md'
//     }`}>
//       {/* Fecha */}
//       <div className="w-32 flex-shrink-0 flex flex-col">
//         <span className="text-sm font-semibold text-teal-800 capitalize">{dateLabel}</span>
//         <span className="text-xs text-teal-700">{entry.date}</span>
//       </div>

//       {/* Información del medicamento */}
//       <div className="flex-1 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-teal-200 rounded-lg">
//             <Pill className="w-5 h-5 text-teal-800" />
//           </div>
//           <div>
//             <div className="text-sm font-medium text-teal-900">
//               {medication?.name || 'Medicamento'}
//             </div>
//             <div className="text-xs text-teal-700">
//               {medication?.dosage || 'Dosis no especificada'}
//             </div>
//             {medication?.description && (
//               <div className="text-xs text-teal-600 mt-1">
//                 {medication.description}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Estado */}
//         <div className="ml-4 flex items-center gap-2">
//           <span 
//             className={`px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 ${currentStatus.pill}`}
//             title={status === "upcoming" ? timeLeftText : currentStatus.text}
//           >
//             {currentStatus.icon}
//             {currentStatus.text}
//           </span>
//         </div>
//       </div>

//       {/* Botón de acción */}
//       <button
//         aria-label={status === "taken" ? "Desmarcar tomado" : "Marcar tomado"}
//         onClick={handleToggle}
//         disabled={!isToday || status === "upcoming" || status === "ignored" || isLoading}
//         className={`ml-4 p-3 rounded-full border-2 transition-all duration-200 ${
//           !isToday || status === "upcoming" || status === "ignored" || isLoading
//             ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
//             : status === "taken" 
//               ? "border-green-600 bg-green-50 hover:bg-green-100 text-green-600"
//               : "border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 text-gray-500 hover:text-green-600"
//         }`}
//       >
//         {isLoading ? (
//           <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
//         ) : (
//           <Check
//             className={`w-5 h-5 transition-colors ${
//               status === "taken" ? "text-green-600" : "text-current"
//             }`}
//           />
//         )}
//       </button>
//     </div>
//   );
// }







import React, { useMemo } from "react";
import { Check, Clock, Pill } from "lucide-react";

export default function MedicineCard({
  entry,
  medication,
  isToday,
  onToggle,
  isLoading = false,
}) {
  const startOfEntryDay = useMemo(
    () => new Date(`${entry.date}T00:00:00`),
    [entry.date]
  );
  // Nota: si quieres que el tiempo restante se actualice sin re-render del padre,
  // podrías usar un setInterval; aquí mantengo tu enfoque.
  const now = useMemo(() => new Date(), []);

  const status = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (entry.date === todayStr) {
      return entry.taken ? "taken" : "pending";
    }
    if (startOfEntryDay > now) return "upcoming";

    return entry.taken ? "taken" : "ignored";
  }, [entry.date, entry.taken, startOfEntryDay, now]);

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

  const handleToggle = () => {
    if (!isToday || isLoading) return;
    if (status === "upcoming" || status === "ignored") return;
    onToggle && onToggle(entry.date);
  };

  const statusConfig = {
    taken: {
      pill: "bg-green-600 text-white",
      text: "Tomada",
      icon: <Check className="w-4 h-4" />,
    },
    pending: {
      pill: "bg-red-500 text-white",
      text: "Pendiente",
      icon: <Clock className="w-4 h-4" />,
    },
    ignored: {
      pill: "bg-red-500 text-white",
      text: "Ignorada",
      icon: null,
    },
    upcoming: {
      pill: "bg-white text-gray-800 border border-gray-200",
      text: timeLeftText,
      icon: <Clock className="w-4 h-4" />,
    },
  };

  const currentStatus = statusConfig[status];

  const dateLabel = useMemo(() => {
    const d = new Date(`${entry.date}T00:00:00`);
    return d.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }, [entry.date]);

  const buttonDisabled =
    !isToday || status === "upcoming" || status === "ignored" || isLoading;

  return (
    <div
      className={`w-full max-w-full bg-teal-100 rounded-lg p-4 sm:p-5 mb-4 shadow-sm transition-all duration-200 overflow-hidden ${
        isLoading ? "opacity-60 pointer-events-none" : "hover:shadow-md"
      } ${isToday ? "ring-1 ring-teal-200" : ""}`}
    >
      {/* Fila 1: fecha + estado (responsive, nunca se sale) */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        {/* Fecha */}
        <div className="min-w-0 flex flex-col">
          <span className="text-sm font-semibold text-teal-800 capitalize truncate">
            {dateLabel}
          </span>
          <span className="text-xs text-teal-700">{entry.date}</span>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 ${currentStatus.pill}`}
            title={status === "upcoming" ? timeLeftText : currentStatus.text}
          >
            {currentStatus.icon}
            <span className="whitespace-nowrap">{currentStatus.text}</span>
          </span>
        </div>
      </div>

      {/* Fila 2: info del medicamento (icono + textos) */}
      <div className="mt-3 sm:mt-4 flex items-start gap-3 min-w-0">
        <div className="p-2 bg-teal-200 rounded-lg shrink-0">
          <Pill className="w-5 h-5 text-teal-800" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-teal-900 truncate">
            {medication?.name || "Medicamento"}
          </div>
          <div className="text-xs text-teal-700 break-words">
            {medication?.dosage || "Dosis no especificada"}
          </div>
          {medication?.description && (
            <div className="text-xs text-teal-600 mt-1 break-words">
              {medication.description}
            </div>
          )}
        </div>
      </div>

      {/* Fila 3: botón acción (full en móvil, compacto en desktop) */}
      <div className="mt-3 sm:mt-4 flex">
        <button
          aria-label={status === "taken" ? "Desmarcar tomado" : "Marcar tomado"}
          onClick={handleToggle}
          disabled={buttonDisabled}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-full border-2 transition-all duration-200",
            "px-4 py-2 text-sm font-medium",
            "w-full sm:w-auto", // responsive
            buttonDisabled
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : status === "taken"
              ? "border-green-600 bg-green-50 hover:bg-green-100 text-green-700"
              : "border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 text-gray-600 hover:text-green-600",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check
              className={`w-5 h-5 transition-colors ${
                status === "taken" ? "text-green-600" : "text-current"
              }`}
            />
          )}
          <span className="whitespace-nowrap">
            {status === "taken" ? "Desmarcar" : "Tomada"}
          </span>
        </button>
      </div>
    </div>
  );
}
