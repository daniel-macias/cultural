"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import sanityClient from "@/lib/sanity";

// Fetch event data from Sanity
async function fetchEvents() {
  const query = `*[_type == "event"]{
    _id,
    name,
    description,
    dates,
    promoImage{
      asset->{url}
    },
    categories,
    priceRange {
      minPrice,
      maxPrice
    },
    location->{
      name,
      address
    },
    trending
  }`;
  return await sanityClient.fetch(query);
}

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


export default function ExpandableCardDemo() {
  const [events, setEvents] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadEvents() {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      
    }
    loadEvents();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
        console.log(events)
      }
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => setActive(event)}
            >
              {event.trending && (
                <p className="top-2 right-2 mb-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  Trending!
                </p>
              )}
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
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-sm font-medium text-green-600 mt-2">
                {event.priceRange
                  ? `$${event.priceRange.minPrice} - $${event.priceRange.maxPrice}`
                  : "Free"}
              </p>
              <h2 className="text-lg font-bold">{event.name}</h2>
              <div key={event._id} className="p-4 border rounded-lg shadow-md">
                

                {/* Check if categories exist before mapping */}
                {event.categories?.length > 0 ? (
                  <div className="flex gap-2 mt-2">
                    {event.categories.map((category: string) => {
                      const categoryInfo = categoryMap[category] || { label: category, color: "bg-gray-500 text-white" };

                      return (
                        <span key={category} className={`px-2 py-1 rounded-lg text-sm font-semibold ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin categorías</p>
                )}
              </div>
              

            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={ref}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => setActive(null)}
              >
                ✕
              </button>
              {active.promoImage?.asset?.url && (
                <div className="w-full h-48 relative">
                  <Image
                    src={active.promoImage.asset.url}
                    alt={active.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold mt-4">{active.name}</h2>
              <p className="text-gray-700 mt-2">{active.description}</p>
              <p className="text-sm font-medium text-green-600 mt-2">
                {active.priceRange
                  ? `$${active.priceRange.minPrice} - $${active.priceRange.maxPrice}`
                  : "Free"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
