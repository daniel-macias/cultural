"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { categoryMap } from "@/utils/categoryMap";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

// Props interface
interface EventType {
  _id: string;
  name: string;
  description: string;
  dates: { start: string; end: string }[];
  promoImage: { asset: { url: string } };
  categories: string[];
}

// Main Carousel Component
export default function TrendingCarousel({ events }: { events: EventType[] }) {
  const [index, setIndex] = useState(0);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [events.length]);

  // Handle manual navigation
  const prevSlide = () => setIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  const nextSlide = () => setIndex((prev) => (prev + 1) % events.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={events[index]._id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={events[index].promoImage.asset.url}
            alt={events[index].name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Event Details Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 p-6 bg-black/80 text-white flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{events[index].name}</h2>
            <p className="mt-2 text-sm line-clamp-3">{events[index].description}</p>

            <p className="mt-2 text-sm text-gray-300">
              {new Date(events[index].dates[0].start).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {events[index].categories.map((cat) => (
                <span key={cat} className={`px-2 py-1 text-xs rounded ${categoryMap[cat]?.color}`}>
                  {categoryMap[cat]?.label || cat}
                </span>
              ))}
            </div>

            <Link
              href={`/events/${events[index]._id}`}
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-center"
            >
              Ver Evento →
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 bg-black/50 rounded-full">
        <FaArrowLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 bg-black/50 rounded-full">
        <FaArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}
