import React from "react";
import MedicineList from "./MedicineList";

/**
 * MedicineLists: componente que agrupa varias listas (varios medicamentos).
 * - lists: array de {id, name, entries: [{date, taken}]}
 * - onToggle(listId, date)
 */
export default function MedicineLists({ lists, onToggle }) {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {lists.map((list) => (
        <MedicineList key={list.id} list={list} onToggle={onToggle} />
      ))}
    </div>
  );
}
