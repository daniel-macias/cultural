"use client";
import React, { useEffect, useState } from "react";
import sanityClient from "@/lib/sanity";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import TrendingCarousel from "@/components/TrendingCarousel";

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

export default function ExpandableCardDemo() {
  const [events, setEvents] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Eventos en Tegucigalpa
        </h1>
        {events.length > 0 && <TrendingCarousel events={events.filter(e => e.trending)} />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} setActive={setActive} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <EventModal 
        isOpen={!!active} 
        onClose={() => setActive(null)} 
        active={active} 
      />
    </div>
  );
}
