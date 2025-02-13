"use client";
import React from "react";
import Image from "next/image";
import { ArrowTrendingUpIcon } from "@heroicons/react/20/solid";
// Category mapping object
const categoryMap: Record<string, { label: string; color: string }> = {
  musica: { label: "Música", color: "bg-blue-500 text-white" },
  teatro: { label: "Teatro", color: "bg-purple-500 text-white" },
  tecnologia: { label: "Tecnología", color: "bg-green-500 text-white" },
  deporte: { label: "Deporte", color: "bg-red-500 text-white" },
  infantil: { label: "Infantil", color: "bg-yellow-500 text-black" },
  moda: { label: "Moda", color: "bg-pink-500 text-white" },
  arte: { label: "Arte", color: "bg-indigo-500 text-white" },
  feria: { label: "Feria", color: "bg-orange-500 text-white" },
  concierto: { label: "Concierto", color: "bg-teal-500 text-white" },
  gastronomico: { label: "Gastronómico", color: "bg-amber-500 text-black" },
  politico: { label: "Político", color: "bg-gray-700 text-white" },
  remoto: { label: "Remoto", color: "bg-cyan-500 text-white" },
  educativo: { label: "Educativo", color: "bg-lime-500 text-black" },
  religioso: { label: "Religioso", color: "bg-rose-500 text-white" },
  recaudacion: { label: "Recaudación", color: "bg-teal-600 text-white" },
  ambiental: { label: "Ambiental", color: "bg-green-700 text-white" },
  cine: { label: "Cine y Televisión", color: "bg-blue-700 text-white" },
  networking: { label: "Networking", color: "bg-gray-600 text-white" },
  videojuegos: { label: "Videojuegos", color: "bg-indigo-700 text-white" },
};

interface EventCardProps {
  event: any;  //TODO: When finishing up the schema, make this a more specific type
  setActive: (event: any) => void;
}

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "... ";
};


const EventCard: React.FC<EventCardProps> = ({ event, setActive }) => {
    const firstDate = event.dates?.[0] 
    ? new Date(event.dates[0].start).toLocaleDateString("es-ES", {
        weekday: "long",   
        year: "numeric",   
        month: "long",     
        day: "numeric",    
      }) 
    : "No date available";

  // Split the date into parts
  const [weekday, day, de, month, de2, year] = firstDate.split(" "); //The "de" might not be the cleanest solution

  return (
    <div
      key={event._id}
      className="relative group bg-white p-4 rounded-lg shadow-md cursor-pointer"
      onClick={() => setActive(event)}
    >

    {/* Trending Square */}
      {event.trending && (
        <div className="transform -translate-x-1/4 -translate-y-1/4 bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-lg z-10">
            <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
            <span className="absolute left-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg rounded-l-none">
                En tendencia
            </span>
        </div>
      )}
        {/* Date square */}
        <div className="opacity-90 absolute top-4 right-4 bg-blue-600 text-white p-4 rounded-lg rounded-t-none flex flex-col justify-center items-center z-10">
            <span className="text-md">{weekday}</span>
            <span className="text-xl font-bold">{day}</span>
            <span className="text-md font-bold">{month}</span>
            <span className="text-sm">{year}</span>
        </div>

      {event.promoImage?.asset?.url && (
        <div className="w-full h-48 relative">
          <Image
            src={event.promoImage.asset.url}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      <h2 className="text-lg font-semibold mt-4">{event.name}</h2>

      <p className="text-gray-600">
        {truncateText(event.description, 150)}
        {event.description.length > 150 && (
          <span className="text-blue-500 font-semibold cursor-pointer">
            Seguir Leyendo
          </span>
        )}
      </p>
      

      <p className="text-sm font-medium text-green-600 mt-2">
        {event.priceRange
          ? `$${event.priceRange.minPrice} - $${event.priceRange.maxPrice}`
          : "Free"}
      </p>

      {/* Categories */}
      {event.categories?.length > 0 ? (
        <div className="flex gap-2 mt-2">
          {event.categories.map((category: string) => {
            const categoryInfo = categoryMap[category] || { label: category, color: "bg-gray-500 text-white" };

            return (
              <span
                key={category}
                className={`px-2 py-1 rounded-lg text-sm font-semibold ${categoryInfo.color}`}
              >
                {categoryInfo.label}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Sin categorías</p>
      )}
    </div>
  );
};

export default EventCard;
