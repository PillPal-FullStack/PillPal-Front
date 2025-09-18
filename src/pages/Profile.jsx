import { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.css";
import History from "./History";
import { CiMedicalClipboard } from "react-icons/ci";

const BASE_URL = "/api";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [meds, setMeds]     = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

    load();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const total     = meds.length;
    const active    = meds.filter(m => m.active !== false).length;
    const inactive  = total - active;
    const lifetime  = meds.filter(m => m.lifetime === true).length;
    return { total, active, inactive, lifetime };
  }, [meds]);

  // Top 5 ordenados por fecha inicio desc
  const recent = useMemo(() => {
    return [...meds]
      .sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
      .slice(0, 5);
  }, [meds]);

  return (
    <>
      <div className="flex justify-center">
        <div className={styles.mainSection}>
          <h1 className="text-2xl font-bold text-teal-900 mb-6 text-center">Mi información</h1>

          {/* Card Resumen (mantiene tu estilo de card) */}
          <div className="max-w-3xl mx-auto p-4 mb-8 bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="p-4 rounded-lg border border-gray-100">
                      <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-600 font-medium">Error: {error}</p>
              </div>
            ) : (
              <>
                <p className="text-xl font-semibold mb-4">Resumen de medicación</p>

                {/* Métricas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricCard label="Total" value={stats.total} />
                  <MetricCard label="Activos" value={stats.active} />
                  <MetricCard label="Inactivos" value={stats.inactive} />
                  <MetricCard label="De por vida" value={stats.lifetime} />
                </div>

                {/* Vista rápida últimos 5 */}
                <div className="mt-6">
                  <p className="text-lg font-semibold mb-3">Últimos medicamentos añadidos</p>
                  {recent.length === 0 ? (
                    <p className="text-gray-500">Aún no hay medicaciones registradas.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {recent.map(m => (
                        <li key={m.id} className="py-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{m.name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {m.dosage || "Dosis no especificada"}
                            </p>
                            {m.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.description}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded-full ${
                                m.active !== false
                                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              {m.active !== false ? "Activo" : "Inactivo"}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDateRange(m.startDate, m.endDate, m.lifetime)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Título + History (mantienes tu estilo original) */}
          <div>
            <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center flex items-center justify-center gap-2">
              <CiMedicalClipboard /> Mi historial de medicación
            </h2>
          </div>
           <History meds={meds} />
        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 bg-white">
      <div className="text-2xl font-extrabold text-teal-900">{value}</div>
      <div className="text-sm text-teal-700">{label}</div>
    </div>
  );
}

function formatDateRange(startDate, endDate, lifetime) {
  if (!startDate) return "Sin fecha definida";
  const start = toES(startDate);
  if (lifetime) return `Desde ${start} (de por vida)`;
  if (!endDate) return `Desde ${start}`;
  return `${start} - ${toES(endDate)}`;
}

function toES(dateStr) {
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
