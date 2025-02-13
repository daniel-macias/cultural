"use client"
import React, { useEffect, useState } from "react";
import sanityClient from "@/lib/sanity";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { EventType } from "@/types/event";
import { categoryMap } from "@/utils/categoryMap";

async function fetchEvents(category?: string): Promise<EventType[]> {
  let query = `*[_type == "event"]{
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

  if (category) {
    query = `*[_type == "event" && "${category}" in categories]{
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
  }

  return await sanityClient.fetch(query); 
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [active, setActive] = useState<EventType | null>(null); 
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 

  useEffect(() => {
    async function loadEvents(category: string = "") {
      const fetchedEvents = await fetchEvents(category);
      setEvents(fetchedEvents);
    }

    loadEvents(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Eventos en Tegucigalpa
        </h1>

        {/* Category Filter Buttons */}
        <div className="mb-6 text-center">
          <p className="text-lg">Filtrar por categoría</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              className={`px-3 py-1 rounded-full ${
                !selectedCategory ? "bg-gray-400 text-white" : "bg-gray-300 text-black"
              }`}
              onClick={() => setSelectedCategory("")}
            >
              Todas
            </button>
            {Object.keys(categoryMap).map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full ${
                  categoryMap[category]?.color || "bg-gray-500 text-white"
                } ${selectedCategory === category ? "border-2 border-black" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {categoryMap[category]?.label || category}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
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
