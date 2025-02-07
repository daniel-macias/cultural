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
  const id = useId();
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
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">Events in Tegucigalpa</h1>
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event._id} className="relative">
              <div
                className="cursor-pointer bg-white p-6 rounded-lg shadow-md"
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
                <h2 className="text-xl font-semibold mt-4">{event.name}</h2>
                <p className="text-gray-600">{event.category?.join(", ")}</p>
              </div>

              {active?._id === event._id && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 w-full h-full bg-white p-6 rounded-lg shadow-lg z-10"
                    ref={ref}
                  >
                    <h2 className="text-xl font-semibold">{active.name}</h2>
                    <p className="text-gray-600">{active.description}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {active.dates?.map((date: any) => (
                        <span key={date.start}>
                          {new Date(date.start).toLocaleString()} -{" "}
                          {new Date(date.end).toLocaleString()}
                        </span>
                      ))}
                    </p>
                    
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
