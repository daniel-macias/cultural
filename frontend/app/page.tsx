"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import sanityClient from "@/lib/sanity";
import EventCard from "@/components/EventCard";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ShareButtons from "@/components/ShareButton";

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
      _id,
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

  const formatDates = (dates: any[]) => {
    return dates.map((date: any, index: number) => {
      const start = new Date(date.start);
      const end = new Date(date.end);
      const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = start.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      return (
        <div key={index} className="mb-2">
          <div className="text-lg font-semibold">{dateStr}</div>
          <div className="text-sm text-gray-600">{`${startTime} - ${endTime}`}</div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Eventos en Tegucigalpa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} setActive={setActive} />
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{active.name}</h2>
                <button
                  onClick={() => setActive(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              

              {active.promoImage?.asset?.url && (
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={active.promoImage.asset.url}
                    alt={active.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}

              <div className="mb-4">
                <p className="text-lg">{active.description}</p>
              </div>

              {/* Display event dates */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Dates</h3>
                {formatDates(active.dates)}
              </div>

              {/* Location */}
              {active.location && (
                <p>
                  Location:{" "}
                  <Link href={`/locations/${active.location._id}`} className="text-blue-600 hover:underline">
                    {active.location.name}
                  </Link>
                </p>
              )}

              {/* Categories */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Categories</h3>
                <div className="flex gap-2">
                  {active.categories?.map((category: string) => (
                    <span
                      key={category}
                      className={`px-3 py-1 rounded-full ${categoryMap[category]?.color || "bg-gray-300 text-black"}`}
                    >
                      {categoryMap[category]?.label || category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              {active.priceRange && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Price Range</h3>
                  <p>{`$${active.priceRange.minPrice} - $${active.priceRange.maxPrice}`}</p>
                </div>
              )}

            <Link href={`/events/${active._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block">
              Ver Más
            </Link>

            {/* Share Button */}
            <ShareButtons url={`${typeof window !== "undefined" ? window.location.origin : ""}/events/${active._id}`} title={""} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
