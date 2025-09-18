import React from "react";
import MedicineCard from "./MedicineCard";
import { FiEdit, FiTrash2 } from "react-icons/fi";

/**
 * MedicineList
 * - list: { id, name, entries: [{date, taken}] }
 * - onToggle(listId, date)
 * - onEdit(listId)
 * - onDelete(listId)
 */
export default function MedicineList({ list, onToggle, onEdit, onDelete }) {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <section className="mb-8">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-teal-900">{list.name}</h3>
          
          {/* Botones editar y eliminar */}
          <button
            onClick={() => onEdit && onEdit(list.id)}
            className="p-1 rounded hover:bg-teal-200 transition"
            title="Editar"
          >
            <FiEdit className="w-5 h-5 text-teal-800" />
          </button>
          <button
            onClick={() => onDelete && onDelete(list.id)}
            className="p-1 rounded hover:bg-red-200 transition"
            title="Eliminar"
          >
            <FiTrash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>

        {/* Contador de días */}
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
