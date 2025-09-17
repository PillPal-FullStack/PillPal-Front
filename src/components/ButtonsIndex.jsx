import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal';

function ButtonsIndex() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login data:", form);

    setShowModal(false);
    navigate("/profile"); 
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
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
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