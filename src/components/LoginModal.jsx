import React from 'react'

function LoginModal({isOpen, onClose, title, children}) {
    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default LoginModal