import React from "react";
import MedicineCard from "./MedicineCard";

/**
 * MedicineList
 * - list: { id, name, entries: [{date, taken}] }
 * - onToggle(listId, date) => llamada al padre para actualizar estado
 */
export default function MedicineList({ list, onToggle }) {
  // calcula string hoy en formato YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <section className="mb-8">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-teal-900">{list.name}</h3>
        <div className="text-sm text-teal-700">{list.entries.length} días</div>
      </header>

      <div className="space-y-4">
        {list.entries.map((entry) => (
          <MedicineCard
            key={entry.date}
            entry={entry}
            isToday={entry.date === todayStr}
            onToggle={(date) => onToggle(list.id, date)}
          />
        ))}
      </div>
    </section>
  );
}
