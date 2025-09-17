import React, { useState } from "react";
import MedicineLists from "../components/MedicineLists";

/**
 * Main: página que contiene todas las listas.
 * Aquí tienes datos de ejemplo; en tu app real vendrán del backend.
 */
export default function Main() {
  // ejemplo: dos listas (dos medicinas), cada una con varios días
  const [lists, setLists] = useState([
    {
      id: "m1",
      name: "Amoxicilina 500mg",
      entries: [
        { date: "2025-09-13", taken: true },
        { date: "2025-09-14", taken: true },
        { date: "2025-09-15", taken: true },
        { date: "2025-09-16", taken: false },
        { date: "2025-09-17", taken: false }, // posible día de hoy
        { date: "2025-09-18", taken: false },
      ],
    },
    {
      id: "m2",
      name: "Paracetamol 500mg",
      entries: [
        { date: "2025-09-15", taken: true },
        { date: "2025-09-16", taken: false },
        { date: "2025-09-17", taken: false },
        { date: "2025-09-18", taken: false },
      ],
    },
  ]);

  // toggle: sólo actualiza la entrada del día recibido
  const handleToggle = (listId, date) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          entries: list.entries.map((e) =>
            e.date === date ? { ...e, taken: !e.taken } : e
          ),
        };
      })
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-teal-900 mb-6">
          Gestión de toma de medicinas
        </h1>

        <MedicineLists lists={lists} onToggle={handleToggle} />
      </div>
    </main>
  );
}
