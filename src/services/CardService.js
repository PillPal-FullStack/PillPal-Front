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

export async function forceDeleteMedication(medicationId) {
  let reminders = [];
  try {
    reminders = await getRemindersByMedicationId(medicationId);
  } catch (_) {}
  if (Array.isArray(reminders)) {
    for (const r of reminders) {
      try { await deleteReminder(r.id); } catch (_) {}
    }
  }
  return deleteMedication(medicationId);
}

// --- Intakes ---
export async function markTaken(medicationId, date = null) {
  const body = date ? { date } : {};
  return request(`/intakes/${medicationId}/taken`, { 
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function markSkipped(medicationId, date = null) {
  const body = date ? { date } : {};
  return request(`/intakes/${medicationId}/skipped`, { 
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function getMedicationIntakes(medicationId) {
  const intakes = await request(`/intakes/medication/${medicationId}`, { method: "GET" });
  if (!intakes) return [];

  // Ordenar por fecha ascendente (más antiguo arriba)
  return [...intakes].sort((a, b) => new Date(a.date) - new Date(b.date));
}
