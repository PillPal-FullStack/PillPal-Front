// import React, { useMemo, useState } from "react";
// import {
//   Search,
//   Filter,
//   Calendar as CalendarIcon,
//   Clock3,
//   CheckCircle2,
//   XCircle,
//   Edit3,
//   Trash2,
// } from "lucide-react";
// import { TbPills } from "react-icons/tb";
// import Swal from "sweetalert2";

// // === Tipos de estado ===
// const STATUS = {
//   taken: { label: "Tomada", className: "bg-green-50 text-green-700 border-green-300" },
//   missed: { label: "Omitida", className: "bg-red-50 text-red-700 border-red-300" },
// };

// // === Mock actualizado con varios días ===
// const MOCK_EVENTS = [
//   {
//     id: 1,
//     name: "Paracetamol",
//     description: "Tomar cada 8 horas después de las comidas",
//     dosage: "500mg",
//     taken: false,
//     active: true,
//     lifetime: false,
//     startDate: "2025-09-15",
//     endDate: "2025-09-15",
//   },
//   {
//     id: 2,
//     name: "Ibuprofeno",
//     description: "Tomar solo si hay dolor",
//     dosage: "200mg",
//     taken: true,
//     active: true,
//     lifetime: false,
//     startDate: "2025-09-14",
//     endDate: "2025-09-14",
//   },
//   {
//     id: 3,
//     name: "Amoxicilina",
//     description: "Cada 12 horas",
//     dosage: "250mg",
//     taken: false,
//     active: true,
//     lifetime: false,
//     startDate: "2025-09-13",
//     endDate: "2025-09-15",
//   },
//   {
//     id: 4,
//     name: "Insulina",
//     description: "Antes de las comidas",
//     dosage: "5 unidades",
//     taken: true,
//     active: true,
//     lifetime: true,
//     startDate: "2025-09-12",
//     endDate: "2025-09-12",
//   },
//   {
//     id: 5,
//     name: "Vitaminas",
//     description: "Tomar una cápsula diaria",
//     dosage: "1 cápsula",
//     taken: false,
//     active: true,
//     lifetime: false,
//     startDate: "2025-09-15",
//     endDate: "2025-09-15",
//   },
// ];

// // Fechas en formato día-mes-año
// const fmtDate = (d) => {
//   const date = new Date(d);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const fmtHumanDateText = (iso) => {
//   const d = new Date(iso);
//   const day = d.getDate();
//   const monthNames = [
//     "enero", "febrero", "marzo", "abril", "mayo", "junio",
//     "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
//   ];
//   const month = monthNames[d.getMonth()];
//   return `Medicamentos del día ${day} de ${month}`;
// };


// export default function History() {
//   const [events, setEvents] = useState(MOCK_EVENTS);
//   const [filters, setFilters] = useState({
//     query: "",
//     dosage: "",
//     description: "",
//     active: "",
//     lifetime: "",
//     status: "",
//     from: "",
//     to: "",
//   });

//   const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

//   // Filtrado avanzado
//   const filtered = useMemo(() => {
//     return events
//       .filter((e) => (filters.query ? e.name.toLowerCase().includes(filters.query.toLowerCase()) : true))
//       .filter((e) => (filters.dosage ? e.dosage.toLowerCase().includes(filters.dosage.toLowerCase()) : true))
//       .filter((e) => (filters.description ? e.description.toLowerCase().includes(filters.description.toLowerCase()) : true))
//       .filter((e) => (filters.active ? e.active === (filters.active === "true") : true))
//       .filter((e) => (filters.lifetime ? e.lifetime === (filters.lifetime === "true") : true))
//       .filter((e) => (filters.status ? (e.taken ? "taken" : "missed") === filters.status : true))
//       .filter((e) => (filters.from ? new Date(e.startDate) >= new Date(filters.from) : true))
//       .filter((e) => (filters.to ? new Date(e.endDate) <= new Date(filters.to) : true))
//       .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
//   }, [events, filters]);

//   const markTaken = (id) =>
//     setEvents((prev) =>
//       prev.map((e) => (e.id === id ? { ...e, taken: true } : e))
//     );

//   const deleteEvent = (id) =>
//     setEvents((prev) => prev.filter((e) => e.id !== id));

//   const handleEdit = (id, field, value) =>
//     setEvents((prev) =>
//       prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
//     );

//   // Agrupar por fecha
//   const grouped = useMemo(() => {
//     const map = new Map();
//     for (const e of filtered) {
//       const key = e.startDate;
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(e);
//     }
//     return Array.from(map.entries())
//       .sort((a, b) => (a[0] < b[0] ? 1 : -1))
//       .map(([dateKey, items]) => ({ dateKey, items }));
//   }, [filtered]);

//   return (
//     <div className="px-4 overflow-x-hidden">
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mx-auto w-full max-w-[1200px]">
//         {/* Columna izquierda - Historial */}
//         <section className="md:col-span-8 space-y-8">
//           {filtered.length === 0 && (
//             <p className="text-sm text-gray-500">No hay registros con esos filtros.</p>
//           )}
//           {grouped.map(({ dateKey, items }) => (
//             <div key={dateKey} className="space-y-3">
//               <h2 className="text-sm font-medium text-gray-700">{fmtHumanDateText(dateKey)}</h2>
//               <ul className="space-y-3">
//                 {items.map((e) => (
//                   <li key={e.id} className="border border-gray-200 rounded-xl bg-white p-4 flex flex-col md:flex-row items-start gap-4">
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <Clock3 className="h-5 w-5 text-gray-500" />
//                       <span className="text-sm text-gray-700 font-medium">{fmtDate(e.startDate)}</span>
//                     </div>

//                     <div className="flex-1 min-w-0 space-y-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <TbPills className="h-5 w-5 text-gray-700" />
//                         <input
//                           type="text"
//                           value={e.name}
//                           onChange={(ev) => handleEdit(e.id, "name", ev.target.value)}
//                           className="text-sm sm:text-base text-gray-900 font-medium truncate border-b border-gray-200"
//                         />
//                         <input
//                           type="text"
//                           value={e.dosage}
//                           onChange={(ev) => handleEdit(e.id, "dosage", ev.target.value)}
//                           className="text-xs text-gray-500 border-b border-gray-200 ml-2"
//                         />
//                       </div>
//                       <input
//                         type="text"
//                         value={e.description}
//                         onChange={(ev) => handleEdit(e.id, "description", ev.target.value)}
//                         className="text-xs text-gray-500 mb-1 w-full border-b border-gray-200"
//                       />
//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <label>
//                           Activo:
//                           <input
//                             type="checkbox"
//                             checked={e.active}
//                             onChange={(ev) => handleEdit(e.id, "active", ev.target.checked)}
//                             className="ml-1"
//                           />
//                         </label>
//                         <label>
//                           De por vida:
//                           <input
//                             type="checkbox"
//                             checked={e.lifetime}
//                             onChange={(ev) => handleEdit(e.id, "lifetime", ev.target.checked)}
//                             className="ml-1"
//                           />
//                         </label>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         Fecha inicio: {fmtDate(e.startDate)} • Fecha fin: {fmtDate(e.endDate)}
//                       </p>
//                       <span
//                         className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full border ${e.taken ? STATUS.taken.className : STATUS.missed.className
//                           }`}
//                       >
//                         {e.taken ? STATUS.taken.label : STATUS.missed.label}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2 mt-2 md:mt-0">
//                       {!e.taken && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const medName = e.name; 
//                             markTaken(e.id); 
//                             Swal.fire({
//                               icon: "success",
//                               title: "Medicina tomada",
//                               text: `${medName} registrada como tomada.`,
//                               timer: 1500,
//                               showConfirmButton: false,
//                             });
//                           }}
//                           className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-gray-100 hover:border-gray-400 cursor-pointer"
//                         >
//                           <CheckCircle2 className="h-4 w-4" /> Tomar
//                         </button>
//                       )}

//                       <button
//                         type="button"
//                         onClick={() => {
//                           Swal.fire({
//                             title: "¿Estás seguro?",
//                             text: "Esta acción no se puede revertir.",
//                             icon: "warning",
//                             showCancelButton: true,
//                             confirmButtonColor: "#3085d6",
//                             cancelButtonColor: "#d33",
//                             confirmButtonText: "Sí, borrar",
//                             cancelButtonText: "Cancelar",
//                           }).then((result) => {
//                             if (result.isConfirmed) {
//                               deleteEvent(e.id);
//                               Swal.fire("¡Borrado!", "El registro ha sido eliminado.", "success");
//                             }
//                           });
//                         }}
//                         className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white hover:border-red-400 hover:text-red-700 cursor-pointer"
//                       >
//                         <Trash2 className="h-4 w-4" /> Borrar
//                       </button>

//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </section>

//         {/* Columna derecha - Filtros */}
//         <aside className="md:col-span-4 space-y-6">
//           <div className="space-y-4">
//             <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//               <Filter className="h-4 w-4 text-gray-500" /> Filtros
//             </h3>

//             <div className="grid grid-cols-1 gap-3">
//               <input
//                 type="text"
//                 value={filters.query}
//                 onChange={(e) => updateFilter("query", e.target.value)}
//                 placeholder="Nombre..."
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               />
//               <input
//                 type="text"
//                 value={filters.dosage}
//                 onChange={(e) => updateFilter("dosage", e.target.value)}
//                 placeholder="Dosis..."
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               />
//               <input
//                 type="text"
//                 value={filters.description}
//                 onChange={(e) => updateFilter("description", e.target.value)}
//                 placeholder="Descripción..."
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               />
//               <select
//                 value={filters.active}
//                 onChange={(e) => updateFilter("active", e.target.value)}
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               >
//                 <option value="">Activo: Todos</option>
//                 <option value="true">Sí</option>
//                 <option value="false">No</option>
//               </select>
//               <select
//                 value={filters.lifetime}
//                 onChange={(e) => updateFilter("lifetime", e.target.value)}
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               >
//                 <option value="">De por vida: Todos</option>
//                 <option value="true">Sí</option>
//                 <option value="false">No</option>
//               </select>
//               <select
//                 value={filters.status}
//                 onChange={(e) => updateFilter("status", e.target.value)}
//                 className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//               >
//                 <option value="">Estado: Todos</option>
//                 <option value="taken">Tomada</option>
//                 <option value="missed">Omitida</option>
//               </select>
//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="date"
//                   value={filters.from}
//                   onChange={(e) => updateFilter("from", e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//                 />
//                 <input
//                   type="date"
//                   value={filters.to}
//                   onChange={(e) => updateFilter("to", e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setFilters({
//                     query: "",
//                     dosage: "",
//                     description: "",
//                     active: "",
//                     lifetime: "",
//                     status: "",
//                     from: "",
//                     to: "",
//                   })
//                 }
//                 className="text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white hover:border-gray-400 cursor-pointer"
//               >
//                 Limpiar filtros
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState, useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Check } from "lucide-react";
// Si ya tienes estos helpers en tu CardService, importa desde allí:
import { markSkipped } from "../services/CardService";

const BASE_URL = "/api";

export default function History({ meds: medsProp }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [meds, setMeds]       = useState(medsProp || []);
  const [intakes, setIntakes] = useState([]);

  // Cargar meds si no vienen por props
  useEffect(() => {
    let cancelled = false;

    async function loadMeds() {
      if (Array.isArray(medsProp)) {
        setMeds(medsProp);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/medications`);
        if (!res.ok) throw new Error(`Error ${res.status} cargando medicaciones`);
        const data = await res.json();
        if (!cancelled) setMeds(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "No se pudieron cargar las medicaciones");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMeds();
    return () => { cancelled = true; };
  }, [medsProp]);

  // Cargar intakes reales para cada medicación
  useEffect(() => {
    let cancelled = false;

    async function loadIntakes() {
      if (!meds || meds.length === 0) {
        setIntakes([]);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const requests = meds.map(async (m) => {
          const res = await fetch(`${BASE_URL}/intakes/medication/${m.id}`);
          if (!res.ok) return [];
          const data = await res.json();

          // Normaliza y enriquece con info de la medicación
          return (Array.isArray(data) ? data : []).map((it) => {
            const ts = it.timestamp ?? (it.date ? `${it.date}T00:00:00` : null);
            const date = (it.date ?? (ts ? ts.slice(0, 10) : "")) || "";
            const taken = it.taken ?? (it.status === "TAKEN");
            return {
              id: it.id ?? `${m.id}-${ts ?? Math.random()}`,
              medicationId: m.id,
              medicationName: m.name,
              medicationDosage: m.dosage || "Dosis no especificada",
              medicationDescription: m.description || "",
              timestamp: ts,
              date,
              taken,
            };
          });
        });

        const all = (await Promise.all(requests)).flat();

        // Solo tomadas
        const onlyTaken = all.filter((i) => i.taken === true);

        // Orden desc por fecha/hora
        onlyTaken.sort(
          (a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
        );

        if (!cancelled) setIntakes(onlyTaken);
      } catch (err) {
        if (!cancelled) setError(err.message || "No se pudo cargar el historial");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadIntakes();
    return () => { cancelled = true; };
  }, [meds]);

  // Agrupar por día (DD MMM YYYY)
  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of intakes) {
      const label = toESDay(it.date || it.timestamp);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(it);
    }
    return Array.from(map.entries());
  }, [intakes]);

  // “Hoy” en YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Desmarcar “Tomada” solo si es de hoy
  const handleUnTakeToday = useCallback(
    async (item) => {
      if (!item || item.date !== todayStr) return;
      try {
        await markSkipped(item.medicationId);
        // Quitamos del historial la entrada de hoy al “desmarcar”
        setIntakes((prev) => prev.filter((i) => !(i.medicationId === item.medicationId && i.date === item.date)));
      } catch (err) {
        console.error("Error desmarcando toma:", err);
        alert("No se pudo desmarcar la toma.");
      }
    },
    [todayStr]
  );

  // Borrar medicación completa (mismo botón/estilo que ya usas)
  const handleDeleteMedication = useCallback(async (medicationId) => {
    if (!window.confirm("¿Eliminar esta medicación y su historial?")) return;
    try {
      const res = await fetch(`${BASE_URL}/medications/${medicationId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status} eliminando medicación`);
      // removemos de listas
      setMeds((prev) => prev.filter((m) => m.id !== medicationId));
      setIntakes((prev) => prev.filter((i) => i.medicationId !== medicationId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la medicación.");
    }
  }, []);

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-xl font-bold text-teal-900 mb-4">Historial de tomas</h3>

        {loading ? (
          <SkeletonList />
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : grouped.length === 0 ? (
          <p className="text-gray-600">Aún no hay tomas registradas.</p>
        ) : (
          <div className="space-y-6">
            {grouped.map(([dayLabel, items]) => (
              <div key={dayLabel}>
                <div className="text-sm text-teal-700 font-semibold mb-2">{dayLabel}</div>
                <ul className="divide-y divide-gray-100">
                  {items.map((it) => (
                    <li key={it.id} className="py-3">
                      {/* Top row: fecha + badge + icono borrar (mismos estilos) */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0 flex flex-col">
                          <span className="text-sm font-semibold text-teal-800 capitalize truncate">
                            {toESWeekday(it.date)}
                          </span>
                          <span className="text-xs text-teal-700">{it.date}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 bg-green-600 text-white"
                            title="Tomada"
                          >
                            <Check className="w-4 h-4" />
                            <span className="whitespace-nowrap">Tomada</span>
                          </span>

                          {/* Botón borrar medicación (icono rojo igual que en tus listas) */}
                          <button
                            onClick={() => handleDeleteMedication(it.medicationId)}
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Eliminar medicamento"
                          >
                            <FiTrash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Contenido: nombre, dosis, descripción */}
                      <div className="mt-3 sm:mt-4 flex items-start gap-3 min-w-0">
                        <div className="p-2 bg-teal-200 rounded-lg shrink-0">
                          {/* Placeholder icono pastilla (mismo tono) */}
                          <svg
                            aria-hidden="true"
                            className="lucide lucide-pill w-5 h-5 text-teal-800"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                            <path d="m8.5 8.5 7 7" />
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-teal-900 truncate">
                            {it.medicationName}
                          </div>
                          <div className="text-xs text-teal-700 break-words">
                            {it.medicationDosage}
                          </div>
                          {it.medicationDescription && (
                            <div className="text-xs text-teal-600 mt-1 break-words">
                              {it.medicationDescription}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botones (conservando estilos) */}
                      <div className="mt-3 sm:mt-4 flex">
                        <button
                          aria-label={
                            it.date === todayStr ? "Desmarcar tomado" : "Tomada"
                          }
                          onClick={() => handleUnTakeToday(it)}
                          disabled={it.date !== todayStr}
                          className={`inline-flex items-center justify-center gap-2 rounded-full border-2 transition-all duration-200 px-4 py-2 text-sm font-medium w-full sm:w-auto ${
                            it.date !== todayStr
                              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                              : "border-green-600 bg-green-50 hover:bg-green-100 text-green-600"
                          }`}
                        >
                          <Check className="w-5 h-5 transition-colors text-current" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* === helpers y skeleton === */

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-50 border border-gray-100 rounded">
            {[1, 2].map((j) => (
              <div
                key={j}
                className="p-3 flex items-start gap-3 border-t border-gray-100 first:border-t-0"
              >
                <div className="h-10 w-10 bg-gray-200 rounded" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function toESDay(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function toESWeekday(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}


