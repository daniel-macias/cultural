"use client";
import React, { useEffect, useState } from "react";
import sanityClient from "@/lib/sanity";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { EventType } from "@/types/event";
import { categoryMap } from "@/utils/categoryMap";
import { useDebounce } from "@/utils/useDebounce"; // Custom debounce hook

// Fetch events from Sanity with category & search
async function fetchEvents(category?: string, searchQuery?: string, showPast? : boolean, page: number = 1, pageSize: number = 10): Promise<EventType[]> {
  let query = `*[_type == "event"`;
  const today = new Date().toISOString();
  // Apply search filter
  if (searchQuery) {
    query += ` && (name match "*${searchQuery}*" || description match "*${searchQuery}*")`;
  }

  // Apply category filter
  if (category) {
    query += ` && "${category}" in categories`;
  }

  if (!showPast) {
    query += ` && dates[0].start >= "${today}"`;
  } else {
    query += ` && dates[0].start < "${today}"`;
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

  query += ` | order(dates[0].start desc) [${(page - 1) * pageSize}...${page * pageSize}]`;

  return await sanityClient.fetch(query);
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [active, setActive] = useState<EventType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 300); // Debounce input by 300ms

  const [showPast, setShowPast] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    async function loadEvents(category: string = "", search: string = "") {
      const fetchedEvents = await fetchEvents(category, search, showPast,currentPage, pageSize);
      setEvents(fetchedEvents);
    }
    loadEvents(selectedCategory, debouncedSearch);
  }, [selectedCategory, debouncedSearch, showPast, currentPage]);

  const handlePagination = (direction: string) => {
    if (direction === "next") {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const hasNextPage = events.length === pageSize;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          Eventos en Tegucigalpa
        </h1>

        {/* 🔎 Search Input and Show Past Events Toggle */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Show Past Events Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPast}
              onChange={() => setShowPast((prev) => !prev)}
              className="hidden"
              id="showPastEvents"
            />
            <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-blue-500">
              <div
                className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                  showPast ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="text-gray-700 text-sm select-none">Mostrar eventos anteriores</span>
          </label>
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

        {/* Displaying No Results Found */}
        {events.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            <p>No se encontraron resultados</p>
          </div>
        )}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} setActive={setActive} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handlePagination("prev")}
            disabled={!hasPreviousPage}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
              !hasPreviousPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePagination("next")}
            disabled={!hasNextPage}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
              !hasNextPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Siguiente
          </button>
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
