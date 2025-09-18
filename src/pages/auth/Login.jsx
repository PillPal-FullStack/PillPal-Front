import React from 'react'

import ButtonsIndex from '../../components/ButtonsIndex'

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-white p-6">
      <img src='/src/assets/logoWithCircles.png'/>
      <h3 className="text-xl font-semibold text-gray-800 text-center">Pensado para tu cuidado y el de los tuyos.</h3>
      <p>Gestiona fácilmente tu medicación.</p>
      <ButtonsIndex />
    </div>
  )
}

export default Login