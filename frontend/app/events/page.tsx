"use client";
import React, { useEffect, useState } from "react";
import sanityClient from "@/lib/sanity";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { EventType } from "@/types/event";
import { categoryMap } from "@/utils/categoryMap";
import { useDebounce } from "@/utils/useDebounce"; // Custom debounce hook

// Fetch events from Sanity with category & search
async function fetchEvents(category?: string, searchQuery?: string): Promise<EventType[]> {
  let query = `*[_type == "event"`;

  // Apply search filter
  if (searchQuery) {
    query += ` && (name match "*${searchQuery}*" || description match "*${searchQuery}*")`;
  }

  // Apply category filter
  if (category) {
    query += ` && "${category}" in categories`;
  }

  query += `]{
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

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [active, setActive] = useState<EventType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 300); // Debounce input by 300ms

  useEffect(() => {
    async function loadEvents(category: string = "", search: string = "") {
      const fetchedEvents = await fetchEvents(category, search);
      setEvents(fetchedEvents);
    }
    loadEvents(selectedCategory, debouncedSearch);
  }, [selectedCategory, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Eventos en Tegucigalpa
        </h1>

        {/* 🔎 Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 📌 Category Filter */}
        <div className="mb-6 text-center">
          <p className="text-lg">Filtrar por categoría</p>
          <div className="flex justify-center gap-2 flex-wrap mt-4">
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
