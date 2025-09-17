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
    { id: 'other', name: 'Otro', icon: MoreHorizontal }
  ];

  const timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '12:00', label: '12:00' },
    { value: '20:00', label: '20:00' },
    { value: '24:00', label: '24:00' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      medicationName,
      selectedForm,
      isReminder,
      selectedTime,
      comments
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-6 sm:mb-8">
            NUEVA MEDICACIÓN
          </h1>

          <div onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Nombre de la medicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la medicación *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  placeholder=""
                />
              </div>
            </div>

            {/* Selecciona la forma de la dosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Selecciona la forma de la dosis *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {dosageForms.map((form) => {
                  const IconComponent = form.icon;
                  return (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => setSelectedForm(form.id)}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-colors min-h-[80px] sm:min-h-[90px] ${
                        selectedForm === form.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-600 text-center leading-tight">
                        {form.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recordatorio y Hora del día */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Recordatorio</span>
                  <button
                    type="button"
                    onClick={() => setIsReminder(!isReminder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isReminder ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isReminder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex-1 ml-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hora del día
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => setSelectedTime(time.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios
              </label>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <input type="checkbox" className="rounded" />
                <span>Opcional</span>
              </div>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder=""
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Añadir la medicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;