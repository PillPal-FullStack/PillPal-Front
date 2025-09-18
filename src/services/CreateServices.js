
const API_BASE = import.meta?.env?.VITE_API_BASE_URL ?? "/api";

// --- utils -------------------------------------------------------------

/** Intenta parsear JSON; si no se puede, devuelve null */
async function safeParseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/** fetch con timeout y mejores errores */
async function fetchJson(path, { timeoutMs = 15000, ...options } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      const data = await safeParseJson(res);
      const text = !data ? await res.text().catch(() => "") : "";
      const message =
        data?.message ||
        data?.error ||
        text?.trim() ||
        `Error ${res.status} ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = data ?? text ?? null;
      throw err;
    }

    // 204 No Content o sin cuerpo
    if (res.status === 204) return null;

    // intenta JSON; si no, devuelve texto
    const data = await safeParseJson(res);
    return data ?? (await res.text());
  } finally {
    clearTimeout(id);
  }
}

/** Convierte un objeto a FormData (null/undefined -> "") */
function toFormData(obj) {
  const fd = new FormData();
  Object.entries(obj ?? {}).forEach(([k, v]) => {
    // En multipart no existe null => el back debería interpretar "" como null
    if (v instanceof Blob) {
      fd.append(k, v);
    } else if (Array.isArray(v)) {
      // Si en el futuro envías arrays, manda claves repetidas
      v.forEach((item) => fd.append(k, item ?? ""));
    } else {
      fd.append(k, v == null ? "" : String(v));
    }
  });
  return fd;
}


function normalizePayload(payload = {}) {
  
  const defaults = {
    name: "",
    description: "",
    imgUrl: "", 
    dosage: "Sin especificar",
    active: true,
    startDate: "", // "YYYY-MM-DD"
    endDate: null, 
    lifetime: false,
    createReminder: false,
    reminderTime: "",            // "HH:mm"
    reminderFrequency: "DAILY",  // DAILY|WEEKLY|MONTHLY
    reminderEnabled: true,
  };

  const merged = { ...defaults, ...payload };

  // Coherencias:
  if (merged.lifetime) {
    merged.endDate = null;
  }

  if (!merged.createReminder) {
    // si no se crea recordatorio, fuerza disabled
    merged.reminderEnabled = false;
    // reminderTime puede quedar vacío
  }

  return merged;
}

// --- API ---------------------------------------------------------------

/**
 * Crea un medicamento.
 * @param {Object} payload Objeto con los campos del medicamento (ver normalizePayload)
 * @param {File|null} imageFile Archivo de imagen opcional (Blob/File)
 * @returns {Promise<Object|null>} El medicamento creado (objeto) o null si 204
 */
export async function createMedication(payload, imageFile = null) {
  const data = normalizePayload(payload);

  if (imageFile) {
    // multipart/form-data (NO poner Content-Type; el navegador añade boundary)
    const fd = toFormData({ ...data, image: imageFile });
    return fetchJson(`/medications/with-image`, {
      method: "POST",
      body: fd,
    });
  }

  // application/json
  return fetchJson(`/medications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// --- Extras útiles (opcionales) ---------------------------------------

/** Ping al back para comprobar salud / CORS */
export async function pingHealth() {
  try {
    return await fetchJson(`/health`, { timeoutMs: 5000 });
  } catch (e) {
    // Devuelve info de error “amigable”
    return { ok: false, error: e.message, status: e.status ?? null };
  }
}
