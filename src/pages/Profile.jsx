import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import History from "./History";
import { CiMedicalClipboard } from "react-icons/ci";

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
    <>
      <div className="flex justify-center">
        <div className={styles.mainSection}>
          <h1 className="text-2xl font-bold text-teal-900 mb-6 text-center">Mi información</h1>

          {/* Información del usuario */}
          <div className="max-w-md mx-auto p-4 mb-8 bg-white rounded-lg shadow-sm">
            <p className="text-xl font-semibold mb-2">Nombre de usuario</p>
            <p className="text-lg text-gray-700 mb-4">{user.username}</p>

            <p className="text-xl font-semibold mb-2">Correo electrónico</p>
            <p className="text-lg text-gray-700 mb-4">{user.email}</p>

            <p className="text-xl font-semibold mb-2">Rol</p>
            <p className="text-lg text-gray-700">{user.role}</p>
          </div>
          {/* Medicación */}
          <div>
            <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center flex items-center justify-center gap-2">
              <CiMedicalClipboard /> Mi historial de medicación
            </h2>
          </div><History />
        </div>
      </div>

      {/* Historial de medicación */}

    </>
  );

}
