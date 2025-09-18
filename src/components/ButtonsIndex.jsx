import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal';

function ButtonsIndex() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("login error");
      }

      const data = await res.json();
      console.log("Token recieved:", data.token);

      localStorage.setItem("token", data.token);

      setShowModal(false);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Incorrect Credencials");
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-7">
      <button
        onClick={() => setShowModal(true)}
        className="w-[362px] h-[48px] bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
      >
        Iniciar sesión
      </button>
      <button
        onClick={() => navigate("/auth/register")}
        className="w-[362px] h-[48px] bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
      >
        Registrarse
      </button>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} title="Iniciar sesión">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Nombre"
            value={form.username}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full h-[48px] bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </LoginModal>
    </div>
  )
}

export default ButtonsIndex