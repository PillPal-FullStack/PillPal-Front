const BASE_URL = "http://localhost:8080/api";

// Obtener todas las medicaciones
export async function getMedications(token) {
  const res = await fetch(`${BASE_URL}/medications`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Error cargando medicaciones: ${res.status}`);
  return res.json();
}

// Obtener el estado de las medicaciones
export async function getMedicationsStatus(token) {
  const res = await fetch(`${BASE_URL}/medications/status`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Error cargando el estado de medicaciones: ${res.status}`);
  return res.json();
}

// Marcar medicación como tomada
export async function markTaken(medicationId, token) {
  const res = await fetch(`${BASE_URL}/intakes/${medicationId}/taken`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Error marcando como tomada: ${res.status}`);
  return res.json();
}

// Marcar medicación como ignorada
export async function markSkipped(medicationId, token) {
  const res = await fetch(`${BASE_URL}/intakes/${medicationId}/skipped`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Error marcando como ignorada: ${res.status}`);
  return res.json();
}

// Obtener historial de tomas para una medicación específica
export async function getMedicationIntakes(medicationId, token) {
  const res = await fetch(`${BASE_URL}/intakes/${medicationId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Error cargando historial de tomas: ${res.status}`);
  return res.json();
}