// import React from "react";
// import MedicineList from "./MedicineList";
// import { FiPlus, FiRefreshCw } from "react-icons/fi";

// export default function MedicineLists({ 
//   medications, 
//   onToggle, 
//   onEdit, 
//   onDelete, 
//   onAddNew,
//   onRefresh,
//   isLoading = false,
//   error = null 
// }) {
  
//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//           <div className="text-red-600 mb-4">
//             <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar medicamentos</h3>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={onRefresh}
//             className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//             disabled={isLoading}
//           >
//             <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//             Intentar nuevamente
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading && medications.length === 0) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[1, 2, 3, 4].map(i => (
//             <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 border-b border-teal-200">
//                 <div className="animate-pulse">
//                   <div className="h-6 bg-teal-200 rounded-lg mb-2 w-3/4"></div>
//                   <div className="h-4 bg-teal-100 rounded mb-3 w-1/2"></div>
//                   <div className="h-3 bg-teal-100 rounded w-2/3"></div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-3">
//                   {[1, 2, 3].map(j => (
//                     <div key={j} className="bg-teal-50 rounded-lg p-4 animate-pulse">
//                       <div className="flex items-center gap-4">
//                         <div className="w-32 flex-shrink-0">
//                           <div className="h-4 bg-teal-200 rounded mb-1"></div>
//                           <div className="h-3 bg-teal-100 rounded w-3/4"></div>
//                         </div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-teal-200 rounded mb-1"></div>
//                           <div className="h-3 bg-teal-100 rounded w-2/3"></div>
//                         </div>
//                         <div className="w-20 h-8 bg-teal-200 rounded-full"></div>
//                         <div className="w-10 h-10 bg-teal-200 rounded-full"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header con acciones */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">
//             Mis Medicamentos ({medications.length})
//           </h2>
//           <p className="text-gray-600 mt-1">
//             Gestiona tus tratamientos y mantén un seguimiento de tus tomas
//           </p>
//         </div>
        
//         <div className="flex gap-3">
//           <button
//             onClick={onRefresh}
//             className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//             disabled={isLoading}
//             title="Actualizar lista"
//           >
//             <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//             {isLoading ? 'Actualizando...' : 'Actualizar'}
//           </button>
          
//           {onAddNew && (
//             <button
//               onClick={onAddNew}
//               className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//               disabled={isLoading}
//             >
//               <FiPlus className="w-4 h-4" />
//               Agregar Medicamento
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Lista de medicamentos */}
//       {medications.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="text-gray-400 mb-4">
//             <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">
//             No tienes medicamentos registrados
//           </h3>
//           <p className="text-gray-500 mb-6">
//             Comienza agregando tu primer medicamento para llevar un seguimiento de tus tratamientos
//           </p>
//           {onAddNew && (
//             <button
//               onClick={onAddNew}
//               className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
//             >
//               <FiPlus className="w-5 h-5" />
//               Agregar mi primer medicamento
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {medications.map((medication) => (
//             <MedicineList 
//               key={medication.id} 
//               medication={medication} 
//               onToggle={onToggle}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               isLoading={isLoading}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





import React from "react";
import MedicineList from "./MedicineList";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

export default function MedicineLists({ 
  medications, 
  onToggle, 
  onEdit, 
  onDelete, 
  onAddNew,
  onRefresh,
  isLoading = false,
  error = null 
}) {
  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar medicamentos</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
            disabled={isLoading}
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && medications.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-5 sm:p-6 border-b border-teal-200">
                <div className="animate-pulse">
                  <div className="h-6 bg-teal-200 rounded-lg mb-2 w-3/4"></div>
                  <div className="h-4 bg-teal-100 rounded mb-3 w-1/2"></div>
                  <div className="h-3 bg-teal-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="bg-teal-50 rounded-lg p-4 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-28 sm:w-32 flex-shrink-0">
                          <div className="h-4 bg-teal-200 rounded mb-1"></div>
                          <div className="h-3 bg-teal-100 rounded w-3/4"></div>
                        </div>
                        <div className="flex-1">
                          <div className="h-4 bg-teal-200 rounded mb-1"></div>
                          <div className="h-3 bg-teal-100 rounded w-2/3"></div>
                        </div>
                        <div className="w-16 sm:w-20 h-8 bg-teal-200 rounded-full"></div>
                        <div className="w-10 h-10 bg-teal-200 rounded-full hidden sm:block"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Mis Medicamentos ({medications.length})
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona tus tratamientos y mantén un seguimiento de tus tomas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
            disabled={isLoading}
            title="Actualizar lista"
          >
            <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors w-full sm:w-auto"
              disabled={isLoading}
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Agregar Medicamento
            </button>
          )}
        </div>
      </div>

      {/* Lista de medicamentos */}
      {medications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No tienes medicamentos registrados
          </h3>
          <p className="text-gray-500 mb-6 px-4">
            Comienza agregando tu primer medicamento para llevar un seguimiento de tus tratamientos
          </p>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors w-full sm:w-auto"
            >
              <FiPlus className="w-5 h-5" />
              Agregar mi primer medicamento
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medications.map((medication) => (
            <MedicineList 
              key={medication.id} 
              medication={medication} 
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
