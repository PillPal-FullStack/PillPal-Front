import React, { useState } from 'react';
import { Search, Pill, Square, Syringe, Droplets, Beaker, MoreHorizontal, Wind } from 'lucide-react';

const CreateForm = () => {
  const [medicationName, setMedicationName] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [isReminder, setIsReminder] = useState(true);
  const [selectedTime, setSelectedTime] = useState('');
  const [comments, setComments] = useState('');

  const dosageForms = [
    { id: 'capsule', name: 'Cápsula', icon: Pill },
    { id: 'pill', name: 'Pastilla', icon: Square },
    { id: 'injection', name: 'Inyección', icon: Syringe },
    { id: 'spray', name: 'Spray', icon: Wind },
    { id: 'drop', name: 'Gota', icon: Droplets },
    { id: 'syrup', name: 'Sirope', icon: Beaker },
    { id: 'other', name: 'Otro', icon: MoreHorizontal },
  ];

  const timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '12:00', label: '12:00' },
    { value: '20:00', label: '20:00' },
    { value: '24:00', label: '24:00' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ medicationName, selectedForm, isReminder, selectedTime, comments });
  };

  return (
    <div className="px-4">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[900px] space-y-10">
        {/* Título */}
        <h1 className="text-center text-gray-800 font-semibold tracking-wide uppercase text-lg">
          NUEVA MEDICACIÓN
        </h1>

        {/* Nombre de la medicación*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la medicación *
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
              placeholder=""
            />
          </div>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* IZQUIERDA */}
          <div className="md:col-span-7">
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
                                ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
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

        
          <div className="md:col-span-5 space-y-6">
            {/* Recordatorio */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Recordatorio</span>
              <button
                type="button"
                onClick={() => setIsReminder((v) => !v)}
                aria-pressed={isReminder}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors
                            ${isReminder ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                              ${isReminder ? 'translate-x-7' : 'translate-x-1.5'}`}
                />
              </button>
            </div>

            {/* Hora del día */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Hora del día</label>
              <div className="flex flex-wrap gap-3">
                {timeOptions.map((t) => {
                  const checked = selectedTime === t.value;
                  return (
                    <label
                      key={t.value}
                      htmlFor={`time-${t.value}`}
                      className={`cursor-pointer px-4 py-2 text-sm rounded-lg border
                                  ${checked
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400'}`}
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
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <input type="checkbox" className="rounded" />
                <span>Opcional</span>
              </div>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Botón centrado y más corto */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-72 md:w-80 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Añadir la medicación
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
