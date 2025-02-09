"use client";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const TopNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          Eventos Tegucigalpa
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Inicio
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-blue-600">
            Eventos
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            Información
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contacto
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md absolute w-full left-0">
          <div className="flex flex-col p-4 space-y-3">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Inicio
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600">
              Eventos
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              Información
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
