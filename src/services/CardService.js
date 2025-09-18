const BASE_URL = "http://localhost:8080/api";

export async function getMedicationsStatus(token) {
  const res = await fetch(`${BASE_URL}/medications/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error cargando el estado de medicaciones");
  return res.json();
}

export async function markTaken(medicationId, token) {
  const res = await fetch(`${BASE_URL}/intakes/${medicationId}/taken`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error marcando como tomada");
  return res.json();
}

export async function markSkipped(medicationId, token) {
  const res = await fetch(`${BASE_URL}/intakes/${medicationId}/skipped`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error marcando como ignorada");
  return res.json();
}
