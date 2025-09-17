import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const mockUser = {
      username: "nombre",
      email: "email@example.com",
      role: "USER",
      medications: [
        {
          id: 1,
          name: "Paracetamol",
          description: "Tomar cada 8 horas después de las comidas",
          dosage: "500mg",
          taken: false,
          imgUrl: "",
          startDate: "2025-09-15",
          endDate: "2025-09-30",
          active: true,
          lifetime: false
        },
        {
          id: 2,
          name: "Ibuprofeno",
          description: "Tomar solo si hay dolor",
          dosage: "200mg",
          taken: true,
          imgUrl: "",
          startDate: "2025-09-10",
          endDate: "2025-09-20",
          active: true,
          lifetime: false
        }
      ]
    };
    setUser(mockUser);
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-lg">Cargando perfil...</p>;
  }

  return (
    <div className="flex justify-center mt-24">
      <div className={styles.mainSection}>
        <h1 className={styles.title}>Mi Perfil</h1>

        <div className="mb-8">
          <p className="text-xl font-semibold mb-2">Nombre de usuario</p>
          <p className="text-lg text-gray-700 mb-4">{user.username}</p>

          <p className="text-xl font-semibold mb-2">Correo electrónico</p>
          <p className="text-lg text-gray-700 mb-4">{user.email}</p>

          <p className="text-xl font-semibold mb-2">Rol</p>
          <p className="text-lg text-gray-700">{user.role}</p>
        </div>

        <div>
          <h2 className={styles.title}>Medicación registrada</h2>
          {user.medications.length === 0 ? (
            <p className="text-gray-500">No tienes medicaciones registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {user.medications.map((med) => (
                <li
                  key={med.id} className={styles.medicationItem}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black">{med.name}</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${med.taken ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}>
                      {med.taken ? "Tomado" : "Pendiente"}
                    </span>
                  </div>

                  <p className="text-gray-700"><span className="font-semibold">Dosificación:</span> {med.dosage}</p>
                  {med.description && (
                    <p className="text-gray-700"><span className="font-semibold">Descripción:</span> {med.description}</p>
                  )}
                  <p className="text-gray-700"><span className="font-semibold">Activo:</span> {med.active ? "Sí" : "No"}</p>
                  <p className="text-gray-700"><span className="font-semibold">De por vida:</span> {med.lifetime ? "Sí" : "No"}</p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Fecha inicio:</span> {med.startDate}
                    {med.endDate && <>, <span className="font-semibold">Fecha fin:</span> {med.endDate}</>}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
