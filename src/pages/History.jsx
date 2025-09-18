import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock3,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
} from "lucide-react";
import { TbPills } from "react-icons/tb";

// === Tipos de estado ===
const STATUS = {
  taken: { label: "Tomada", className: "bg-green-50 text-green-700 border-green-300" },
  missed: { label: "Omitida", className: "bg-red-50 text-red-700 border-red-300" },
};

// === Mock actualizado con varios días ===
const MOCK_EVENTS = [
  {
    id: 1,
    name: "Paracetamol",
    description: "Tomar cada 8 horas después de las comidas",
    dosage: "500mg",
    taken: false,
    active: true,
    lifetime: false,
    startDate: "2025-09-15",
    endDate: "2025-09-15",
  },
  {
    id: 2,
    name: "Ibuprofeno",
    description: "Tomar solo si hay dolor",
    dosage: "200mg",
    taken: true,
    active: true,
    lifetime: false,
    startDate: "2025-09-14",
    endDate: "2025-09-14",
  },
  {
    id: 3,
    name: "Amoxicilina",
    description: "Cada 12 horas",
    dosage: "250mg",
    taken: false,
    active: true,
    lifetime: false,
    startDate: "2025-09-13",
    endDate: "2025-09-15",
  },
  {
    id: 4,
    name: "Insulina",
    description: "Antes de las comidas",
    dosage: "5 unidades",
    taken: true,
    active: true,
    lifetime: true,
    startDate: "2025-09-12",
    endDate: "2025-09-12",
  },
  {
    id: 5,
    name: "Vitaminas",
    description: "Tomar una cápsula diaria",
    dosage: "1 cápsula",
    taken: false,
    active: true,
    lifetime: false,
    startDate: "2025-09-15",
    endDate: "2025-09-15",
  },
];

// Fechas en formato día-mes-año
const fmtDate = (d) => {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const fmtHumanDateText = (iso) => {
  const d = new Date(iso);
  const day = d.getDate();
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const month = monthNames[d.getMonth()];
  return `Medicamentos del día ${day} de ${month}`;
};


export default function History() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [filters, setFilters] = useState({
    query: "",
    dosage: "",
    description: "",
    active: "",
    lifetime: "",
    status: "",
    from: "",
    to: "",
  });

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  // Filtrado avanzado
  const filtered = useMemo(() => {
    return events
      .filter((e) => (filters.query ? e.name.toLowerCase().includes(filters.query.toLowerCase()) : true))
      .filter((e) => (filters.dosage ? e.dosage.toLowerCase().includes(filters.dosage.toLowerCase()) : true))
      .filter((e) => (filters.description ? e.description.toLowerCase().includes(filters.description.toLowerCase()) : true))
      .filter((e) => (filters.active ? e.active === (filters.active === "true") : true))
      .filter((e) => (filters.lifetime ? e.lifetime === (filters.lifetime === "true") : true))
      .filter((e) => (filters.status ? (e.taken ? "taken" : "missed") === filters.status : true))
      .filter((e) => (filters.from ? new Date(e.startDate) >= new Date(filters.from) : true))
      .filter((e) => (filters.to ? new Date(e.endDate) <= new Date(filters.to) : true))
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [events, filters]);

  const markTaken = (id) =>
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, taken: true } : e))
    );

  const deleteEvent = (id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  const handleEdit = (id, field, value) =>
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  // Agrupar por fecha
  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const key = e.startDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([dateKey, items]) => ({ dateKey, items }));
  }, [filtered]);

  return (
    <div className="px-4 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mx-auto w-full max-w-[1200px]">
        {/* Columna izquierda - Historial */}
        <section className="md:col-span-8 space-y-8">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500">No hay registros con esos filtros.</p>
          )}
          {grouped.map(({ dateKey, items }) => (
            <div key={dateKey} className="space-y-3">
              <h2 className="text-sm font-medium text-gray-700">{fmtHumanDateText(dateKey)}</h2>
              <ul className="space-y-3">
                {items.map((e) => (
                  <li key={e.id} className="border border-gray-200 rounded-xl bg-white p-4 flex flex-col md:flex-row items-start gap-4">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Clock3 className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">{fmtDate(e.startDate)}</span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TbPills className="h-5 w-5 text-gray-700" />
                        <input
                          type="text"
                          value={e.name}
                          onChange={(ev) => handleEdit(e.id, "name", ev.target.value)}
                          className="text-sm sm:text-base text-gray-900 font-medium truncate border-b border-gray-200"
                        />
                        <input
                          type="text"
                          value={e.dosage}
                          onChange={(ev) => handleEdit(e.id, "dosage", ev.target.value)}
                          className="text-xs text-gray-500 border-b border-gray-200 ml-2"
                        />
                      </div>
                      <input
                        type="text"
                        value={e.description}
                        onChange={(ev) => handleEdit(e.id, "description", ev.target.value)}
                        className="text-xs text-gray-500 mb-1 w-full border-b border-gray-200"
                      />
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <label>
                          Activo:
                          <input
                            type="checkbox"
                            checked={e.active}
                            onChange={(ev) => handleEdit(e.id, "active", ev.target.checked)}
                            className="ml-1"
                          />
                        </label>
                        <label>
                          De por vida:
                          <input
                            type="checkbox"
                            checked={e.lifetime}
                            onChange={(ev) => handleEdit(e.id, "lifetime", ev.target.checked)}
                            className="ml-1"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Fecha inicio: {fmtDate(e.startDate)} • Fecha fin: {fmtDate(e.endDate)}
                      </p>
                      <span
                        className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full border ${e.taken ? STATUS.taken.className : STATUS.missed.className
                          }`}
                      >
                        {e.taken ? STATUS.taken.label : STATUS.missed.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      {!e.taken && (
                        <button
                          type="button"
                          onClick={() => markTaken(e.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-gray-100 hover:border-gray-400"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Tomar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteEvent(e.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white hover:border-red-400 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" /> Borrar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Columna derecha - Filtros */}
        <aside className="md:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" /> Filtros
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={filters.query}
                onChange={(e) => updateFilter("query", e.target.value)}
                placeholder="Nombre..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
              <input
                type="text"
                value={filters.dosage}
                onChange={(e) => updateFilter("dosage", e.target.value)}
                placeholder="Dosis..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
              <input
                type="text"
                value={filters.description}
                onChange={(e) => updateFilter("description", e.target.value)}
                placeholder="Descripción..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
              <select
                value={filters.active}
                onChange={(e) => updateFilter("active", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">Activo: Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
              <select
                value={filters.lifetime}
                onChange={(e) => updateFilter("lifetime", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">De por vida: Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">Estado: Todos</option>
                <option value="taken">Tomada</option>
                <option value="missed">Omitida</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => updateFilter("from", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                />
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => updateFilter("to", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    query: "",
                    dosage: "",
                    description: "",
                    active: "",
                    lifetime: "",
                    status: "",
                    from: "",
                    to: "",
                  })
                }
                className="text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white hover:border-gray-400"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
