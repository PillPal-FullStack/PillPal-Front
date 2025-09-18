import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PauseCircle,
  Edit3,
  Trash2,
  Pill,
  Square,
  Syringe,
  Droplets,
  Beaker,
  Wind,
  MoreHorizontal,
} from "lucide-react";

/**
 * Historial de Medicamentos
 * --------------------------------------------------
 * - Estilos alineados con tu app (Tailwind, inputs con borde gris y fondo blanco).
 * - Sin contenedores con tarjeta/fondo extra: solo contenido centrado.
 * - Dos columnas en desktop: izquierda listado; derecha filtros/resumen.
 * - En móvil: una columna.
 * - Datos mockeados y funciones stub para remplazar por API real.
 */

// === Tipos de estado y utilidades ===
const STATUS = {
  taken: { label: "Tomada", className: "bg-green-50 text-green-700 border-green-300" },
  missed: { label: "Omitida", className: "bg-red-50 text-red-700 border-red-300" },
  late: { label: "Atrasada", className: "bg-amber-50 text-amber-700 border-amber-300" },
  snoozed: { label: "Pospuesta", className: "bg-sky-50 text-sky-700 border-sky-300" },
  partial: { label: "Parcial", className: "bg-violet-50 text-violet-700 border-violet-300" },
};

const FORM_ICONS = {
  capsule: Pill,
  pill: Square,
  injection: Syringe,
  spray: Wind,
  drop: Droplets,
  syrup: Beaker,
  other: MoreHorizontal,
};

// === Mock de datos (remplaza por tu API) ===
const MOCK_EVENTS = [
  {
    id: "evt_1",
    medicationId: "med_1",
    medicationName: "Ibuprofeno",
    form: "pill",
    amount: 1,
    unit: "pastilla",
    scheduledAt: new Date().toISOString(),
    takenAt: new Date().toISOString(),
    status: "taken",
    notes: "Con comida",
  },
  {
    id: "evt_2",
    medicationId: "med_2",
    medicationName: "Amoxicilina",
    form: "capsule",
    amount: 1,
    unit: "cápsula",
    scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "late",
    notes: "",
  },
  {
    id: "evt_3",
    medicationId: "med_3",
    medicationName: "Insulina",
    form: "injection",
    amount: 5,
    unit: "unidades",
    scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "missed",
  },
  {
    id: "evt_4",
    medicationId: "med_1",
    medicationName: "Ibuprofeno",
    form: "pill",
    amount: 1,
    unit: "pastilla",
    scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    status: "taken",
  },
];

// === Utils de fechas ===
const toISODate = (d) => new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD
const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtHumanDate = (iso) => {
  const d = new Date(iso);
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  const isoKey = toISODate(d);
  if (isoKey === toISODate(hoy)) return "Hoy";
  if (isoKey === toISODate(ayer)) return "Ayer";
  return d.toLocaleDateString([], { weekday: "long", day: "2-digit", month: "short" });
};

export default function History() {
  // Estado de datos (remplazar por fetch a tu API)
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(""); // "taken" | "missed" | ...
  const [medication, setMedication] = useState("");
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState("");

  // === Stubs API ===
  // Ejemplo de cómo conectar con tu backend más adelante
  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`/api/history?from=${from}&to=${to}&q=${query}&status=${status}&med=${medication}`)
  //     .then((r) => r.json())
  //     .then((data) => setEvents(data))
  //     .catch((e) => console.error(e))
  //     .finally(() => setLoading(false));
  // }, [from, to, query, status, medication]);

  const uniqueMeds = useMemo(() => {
    const set = new Set(events.map((e) => e.medicationName));
    return Array.from(set).sort();
  }, [events]);

  // Filtro local (reemplaza por tu query en BD)
  const filtered = useMemo(() => {
    return events
      .filter((e) => (status ? e.status === status : true))
      .filter((e) => (medication ? e.medicationName === medication : true))
      .filter((e) => (from ? toISODate(e.scheduledAt) >= from : true))
      .filter((e) => (to ? toISODate(e.scheduledAt) <= to : true))
      .filter((e) =>
        query
          ? `${e.medicationName} ${e.notes ?? ""} ${e.unit}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  }, [events, status, medication, from, to, query]);

  // Agrupar por día
  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const key = toISODate(e.scheduledAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    // ordenar cada grupo por hora desc
    for (const arr of map.values()) {
      arr.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
    }
    // devolver array ordenado por fecha desc
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([dateKey, items]) => ({ dateKey, items }));
  }, [filtered]);

  // Acciones (stubs locales -> cambia por API)
  const updateEvent = (id, patch) => {
    // Aquí harías: await fetch(`/api/history/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const markTakenNow = (id) => {
    updateEvent(id, { status: "taken", takenAt: new Date().toISOString() });
  };

  const deleteEvent = (id) => {
    // Aquí harías DELETE a tu API
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Métricas simples (últimos 7 días)
  const metrics = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = events.filter((e) => new Date(e.scheduledAt) >= sevenDaysAgo);
    const total = recent.length || 1;
    const taken = recent.filter((e) => e.status === "taken").length;
    const missed = recent.filter((e) => e.status === "missed").length;
    const adherence = Math.round((taken / total) * 100);
    return { adherence, taken, missed };
  }, [events]);

  return (
    <div className="px-4 overflow-x-hidden">
      {/* Título */}
      <h1 className="text-center text-gray-800 font-semibold tracking-wide uppercase text-sm mb-6">
        Historial
      </h1>

      {/* Layout responsive: filtros/resumen (derecha en md+) y lista (izquierda) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mx-auto w-full max-w-[1000px]">
        {/* Columna izquierda: LISTA */}
        <section className="md:col-span-7 space-y-8">
          {loading && (
            <p className="text-sm text-gray-500">Cargando historial…</p>
          )}

          {!loading && grouped.length === 0 && (
            <p className="text-sm text-gray-500">No hay registros con esos filtros.</p>
          )}

          {grouped.map(({ dateKey, items }) => (
            <div key={dateKey} className="space-y-3">
              <h2 className="text-sm font-medium text-gray-700">
                {fmtHumanDate(dateKey)}
              </h2>
              <ul className="space-y-3">
                {items.map((e) => {
                  const Icon = FORM_ICONS[e.form] ?? Pill;
                  const st = STATUS[e.status];
                  return (
                    <li
                      key={e.id}
                      className="w-full border border-gray-200 rounded-xl bg-white p-4 flex items-start gap-4"
                    >
                      {/* hora + icono */}
                      <div className="flex items-center gap-3 min-w-[110px]">
                        <Clock3 className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {fmtTime(e.scheduledAt)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-gray-700" />
                          <span className="text-sm sm:text-base text-gray-900 font-medium truncate">
                            {e.medicationName}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {e.amount} {e.unit}
                          </span>
                        </div>
                        {e.notes ? (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.notes}</p>
                        ) : null}
                        {/* estado */}
                        <span
                          className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full border ${st?.className ?? "border-gray-300 bg-gray-100 text-gray-700"}`}
                        >
                          {st?.label ?? e.status}
                        </span>
                      </div>

                      {/* acciones */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => markTakenNow(e.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-gray-100 hover:border-gray-400"
                          title="Marcar tomada ahora"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Tomar
                        </button>
                        <label className="sr-only" htmlFor={`status-${e.id}`}>Cambiar estado</label>
                        <select
                          id={`status-${e.id}`}
                          value={e.status}
                          onChange={(ev) => updateEvent(e.id, { status: ev.target.value })}
                          className="px-2 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                        >
                          {Object.entries(STATUS).map(([key, v]) => (
                            <option key={key} value={key}>{v.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => updateEvent(e.id, { notes: prompt("Notas:", e.notes || "") || e.notes })}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white hover:border-gray-400"
                          title="Editar notas"
                        >
                          <Edit3 className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(e.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white hover:border-red-400 hover:text-red-700"
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                          Borrar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* Columna derecha: FILTROS + RESUMEN */}
        <aside className="md:col-span-5 space-y-6">
          {/* Resumen */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Resumen (7 días)</h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-900">{metrics.adherence}%</span>
                <span className="text-xs text-gray-500">Adherencia</span>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">{metrics.taken} tomadas</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{metrics.missed} omitidas</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" /> Filtros
            </h3>
            {/* Buscar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o nota…"
                className="w-full pl-10 pr-3 py-2.5 rounded-full border border-gray-300 bg-white"
              />
            </div>

            {/* Medicamento */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Medicamento</label>
              <select
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">Todos</option>
                {uniqueMeds.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">Todos</option>
                {Object.entries(STATUS).map(([key, v]) => (
                  <option key={key} value={key}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Rango fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" /> Desde
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" /> Hasta
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setQuery(""); setMedication(""); setStatus(""); setFrom(""); setTo(""); }}
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
