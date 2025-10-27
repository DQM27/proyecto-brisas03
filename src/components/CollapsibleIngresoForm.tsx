"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import IngresoForm from './IngresoForm';

export default function CollapsibleIngresoForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-linear-to-r from-green-600 to-green-700 
                   hover:from-green-700 hover:to-green-800
                   text-white font-semibold py-4 px-6 rounded-xl 
                   shadow-lg hover:shadow-xl transition-all duration-200
                   flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-lg">
            {isOpen ? 'Ocultar Formulario' : 'Registrar Nuevo Ingreso'}
          </span>
        </div>
        
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Formulario con animación */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="bg-white rounded-xl shadow-md p-6">
          <IngresoForm onSuccess={() => setIsOpen(false)} />
        </div>
      </div>
    </div>
  );
}