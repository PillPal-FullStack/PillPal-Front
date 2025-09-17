import React from 'react'

function ButtonsIndex() {
  return (
    <div className='flex flex-col gap-4'>
        <button className="w-[362px] h-[48px] bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer">
            Iniciar sesión</button>
        <button className="w-[362px] h-[48px] bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer">
            Registrarse</button>
    </div>
  )
}

export default ButtonsIndex