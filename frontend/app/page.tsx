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
    category,
    priceRange {
      minPrice,
      maxPrice
    }
  }`;
  return await sanityClient.fetch(query);
}

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
