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
  let events = await sanityClient.fetch(query);

  // Ensure events have valid dates and sort by earliest date
  events = events
    .map((event: { dates: { start: string | number | Date; }[]; }) => ({
      ...event,
      earliestDate: event.dates ? new Date(event.dates[0].start) : null
    }))
    .filter((event: { earliestDate: any; }) => event.earliestDate) 
    .sort((a: { earliestDate: number; }, b: { earliestDate: number; }) => a.earliestDate - b.earliestDate); // Sort ascending

  return events;
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

  const today = new Date();
  const next7 = new Date();
  next7.setDate(today.getDate() + 7);

  const next14 = new Date();
  next14.setDate(today.getDate() + 14);

  // Filter events
  const next7DaysEvents = events.filter((event) => {
    const eventDate = new Date(event.dates[0]?.start);
    return eventDate >= today && eventDate <= next7;
  });

  const next14DaysEvents = events.filter((event) => {
    const eventDate = new Date(event.dates[0]?.start);
    return eventDate > next7 && eventDate <= next14;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900">
          Eventos Destacados
        </h1>
       
        {events.length > 0 && <TrendingCarousel events={events.filter(e => e.trending)} />}

          {/* Next 7 Days */}
         {next7DaysEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Eventos en los próximos 7 días</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {next7DaysEvents.map((event) => (
                <EventCard key={event._id} event={event} setActive={setActive} />
              ))}
            </div>
          </>
        )}

        {/* Next 14 Days */}
        {next14DaysEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Eventos en los próximos 14 días</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {next14DaysEvents.map((event) => (
                <EventCard key={event._id} event={event} setActive={setActive} />
              ))}
            </div>
          </>
        )}

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
