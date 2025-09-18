import React, { useState } from "react";
import { Search, Pill, Square, Syringe, Droplets, Beaker, MoreHorizontal, Wind } from "lucide-react";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || `http://localhost:8080`;

const CreateForm = () => {
  const [medicationName, setMedicationName] = useState("");
  const [selectedForm, setSelectedForm] = useState(""); // capsule|pill|...
  const [isActive, setIsActive] = useState(true);
  const [lifetime, setLifetime] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dosageText, setDosageText] = useState("");
  const [comments, setComments] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const dosageForms = [
    { id: "capsule", name: "Cápsula", icon: Pill },
    { id: "pill", name: "Pastilla", icon: Square },
    { id: "injection", name: "Inyección", icon: Syringe },
    { id: "spray", name: "Spray", icon: Wind },
    { id: "drop", name: "Gota", icon: Droplets },
    { id: "syrup", name: "Sirope", icon: Beaker },
    { id: "other", name: "Otro", icon: MoreHorizontal },
  ];

  const timeOptions = [
    { value: "08:00", label: "08:00" },
    { value: "12:00", label: "12:00" },
    { value: "20:00", label: "20:00" },
    { value: "24:00", label: "24:00" }, // si luego quieres validarlo, cámbialo por "00:00"
  ];

  function buildDosage() {
    const formPart = selectedForm ? `Forma: ${selectedForm}` : "";
    const textPart = dosageText ? `Dosis: ${dosageText}` : "";
    const timePart = selectedTime ? `Hora: ${selectedTime}` : "";
    return [formPart, textPart, timePart].filter(Boolean).join(" | ");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");

    if (!medicationName.trim()) return setErrorMsg("El nombre es obligatorio.");
    if (!selectedForm) return setErrorMsg("Selecciona la forma de la dosis.");
    if (!startDate) return setErrorMsg("La fecha de inicio es obligatoria.");
    if (!lifetime && !endDate) return setErrorMsg("Indica fecha de fin o marca 'uso de por vida'.");

    const token = localStorage.getItem("token");
    if (!token) return setErrorMsg("No hay sesión. Inicia sesión para crear.");

    const bodyCommon = {
      name: medicationName.trim(),
      description: comments?.trim() || null,
      imgUrl: null,
      dosage: buildDosage() || "Sin especificar",
      active: isActive,
      startDate,
      endDate: lifetime ? null : endDate,
      lifetime,
    };

    try {
      setLoading(true);

      let res;
      if (imageFile) {
        const fd = new FormData();
        Object.entries(bodyCommon).forEach(([k, v]) => {
          fd.append(k, v === null ? "" : String(v));
        });
        fd.append("image", imageFile);

        res = await fetch(`${API_BASE}/api/medications/with-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        res = await fetch(`${API_BASE}/api/medications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyCommon),
        });
      }

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setOkMsg(`Medicamento creado (id ${data.id}).`);
      // limpia
      setMedicationName("");
      setSelectedForm("");
      setIsActive(true);
      setLifetime(false);
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate("");
      setSelectedTime("");
      setDosageText("");
      setComments("");
      setImageFile(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function safeJson(res) {
    try { return await res.json(); } catch { return null; }
  }

  return (
    <div className="px-4">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[900px] space-y-10">
        <h1 className="text-center text-gray-800 font-semibold tracking-wide uppercase text-lg">
          NUEVA MEDICACIÓN
        </h1>

        {/* Nombre */}
        <div>
          <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la medicación *
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="medicationName"
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* IZQUIERDA */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Selecciona la forma de la dosis *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {dosageForms.map((form) => {
                  const Icon = form.icon;
                  const checked = selectedForm === form.id;
                  return (
                    <label
                      key={form.id}
                      htmlFor={`form-${form.id}`}
                      className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-4 min-h-[90px]
                                  rounded-xl border bg-white shadow-sm transition
                                  ${checked ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    >
                      <input
                        id={`form-${form.id}`}
                        type="radio"
                        name="dosageForm"
                        value={form.id}
                        checked={checked}
                        onChange={() => setSelectedForm(form.id)}
                        className="sr-only"
                      />
                      <Icon className="h-6 w-6 text-gray-700" />
                      <span className="text-xs sm:text-sm text-gray-700 text-center">{form.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Dosis (texto libre) */}
            <div>
              <label htmlFor="dosageText" className="block text-sm font-medium text-gray-700 mb-2">
                Dosis (ej. 500 mg)
              </label>
              <input
                id="dosageText"
                type="text"
                value={dosageText}
                onChange={(e) => setDosageText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Imagen opcional */}
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen (opcional)
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* DERECHA */}
          <div className="md:col-span-5 space-y-6">
            {/* Activo */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Activo</span>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                aria-pressed={isActive}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors
                            ${isActive ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                              ${isActive ? "translate-x-7" : "translate-x-1.5"}`}
                />
              </button>
            </div>

            {/* Hora del día (guardada dentro de "dosage") */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-3">Hora del día</span>
              <div className="flex flex-wrap gap-3">
                {timeOptions.map((t) => {
                  const checked = selectedTime === t.value;
                  return (
                    <label
                      key={t.value}
                      htmlFor={`time-${t.value}`}
                      className={`cursor-pointer px-4 py-2 text-sm rounded-lg border
                                  ${checked
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400"}`}
                    >
                      <input
                        id={`time-${t.value}`}
                        type="radio"
                        name="time"
                        value={t.value}
                        checked={checked}
                        onChange={() => setSelectedTime(t.value)}
                        className="sr-only"
                      />
                      {t.label}
                    </label>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                (El backend no tiene campo de hora; la guardamos dentro de <b>dosage</b>.)
              </p>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Inicio *
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    Fin
                  </label>
                  <label htmlFor="lifetime" className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      id="lifetime"
                      type="checkbox"
                      checked={lifetime}
                      onChange={(e) => setLifetime(e.target.checked)}
                      className="rounded"
                    />
                    Uso de por vida (sin fin)
                  </label>
                </div>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={lifetime}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Comentarios -> description */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        {okMsg && <p className="text-green-600 text-sm">{okMsg}</p>}

        {/* Botón */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-72 md:w-80 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700
                       transition-colors disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Añadir la medicación"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
