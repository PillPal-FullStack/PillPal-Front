// const BASE_URL = "/api";

// // Obtener todas las medicaciones
// export async function getMedications(token) {
//   const res = await fetch(`${BASE_URL}/medications`, {
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   });
//   if (!res.ok) throw new Error(`Error cargando medicaciones: ${res.status}`);
//   return res.json();
// }

// // Obtener el estado de las medicaciones
// export async function getMedicationsStatus(token) {
//   const res = await fetch(`${BASE_URL}/medications/status`, {
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   });
//   if (!res.ok) throw new Error(`Error cargando el estado de medicaciones: ${res.status}`);
//   return res.json();
// }

// // Marcar medicación como tomada
// export async function markTaken(medicationId, token) {
//   const res = await fetch(`${BASE_URL}/intakes/${medicationId}/taken`, {
//     method: "POST",
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   });
//   if (!res.ok) throw new Error(`Error marcando como tomada: ${res.status}`);
//   return res.json();
// }

// // Marcar medicación como ignorada
// export async function markSkipped(medicationId, token) {
//   const res = await fetch(`${BASE_URL}/intakes/${medicationId}/skipped`, {
//     method: "POST",
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   });
//   if (!res.ok) throw new Error(`Error marcando como ignorada: ${res.status}`);
//   return res.json();
// }

// // Obtener historial de tomas para una medicación específica
// export async function getMedicationIntakes(medicationId, token) {
//   const res = await fetch(`${BASE_URL}/intakes/${medicationId}`, {
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   });
//   if (!res.ok) throw new Error(`Error cargando historial de tomas: ${res.status}`);
//   return res.json();
// }
// src/services/CardService.js
const BASE_URL = "/api";

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const data = await safeJson(res);
    const msg = data?.message || data?.error || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  if (res.status === 204) return null;
  return safeJson(res);
}

// --- Medications ---
export async function getMedications() {
  return request(`/medications`, { method: "GET" });
}

export async function getMedicationsStatus() {
  return request(`/medications/status`, { method: "GET" });
}

export async function deleteMedication(medicationId) {
  return request(`/medications/${medicationId}`, { method: "DELETE" });
}

// --- Reminders ---
export async function getRemindersByMedicationId(medicationId) {
  return request(`/reminders/medication/${medicationId}`, { method: "GET" });
}

export async function deleteReminder(reminderId) {
  return request(`/reminders/${reminderId}`, { method: "DELETE" });
}

/**
 * Borra primero los recordatorios asociados y luego la medicación.
 * Evita errores de FK si el back no hace cascade.
 */
export async function forceDeleteMedication(medicationId) {
  let reminders = [];
  try {
    reminders = await getRemindersByMedicationId(medicationId);
  } catch (_) {
    // si falla, seguimos intentando borrar la medicación igualmente
  }

  if (Array.isArray(reminders)) {
    for (const r of reminders) {
      try { await deleteReminder(r.id); } catch (_) { /* continua */ }
    }
  }

  return deleteMedication(medicationId);
}

// --- Intakes ---
export async function markTaken(medicationId) {
  return request(`/intakes/${medicationId}/taken`, { method: "POST" });
}

export async function markSkipped(medicationId) {
  return request(`/intakes/${medicationId}/skipped`, { method: "POST" });
}

export async function getMedicationIntakes(medicationId) {
  return request(`/intakes/${medicationId}`, { method: "GET" });
}
