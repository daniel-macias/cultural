"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import sanityClient from "@/lib/sanity";
import { EventType } from "@/types/event";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { FaMapMarkerAlt } from 'react-icons/fa';
import AddToCalendar from "@/components/AddToCalendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { categoryMap } from "@/utils/categoryMap";
import { Key } from "react";
import ShareButtons from "@/components/ShareButton";
import EventSkeleton from "@/components/EventSkeleton";

const formatDateInSpanish = (dateString: string) => {
  return format(new Date(dateString), "d 'de' MMMM yyyy, HH:mm", { locale: es });
};

const EventPage = () => {
  const { id } = useParams(); 
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; 

    const fetchEvent = async () => {
      try {
        const query = `*[_type == "event" && _id == $id][0]{
          _id,
          name,
          description,
          dates,
          promoImage {
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

        const result = await sanityClient.fetch(query, { id });

        if (!result) {
          setEvent(null);
        } else {
          setEvent(result);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false); // Stops loading state after fetch
      }
    };

    fetchEvent();
  }, [id]); //

  if (loading) return <EventSkeleton />; // Show skeleton while loading
  if (!event) return notFound(); 
  const eventDates = event.dates || [];

  //TODO: The will-change-auto may be causing a hydration error
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 pt-20 overflow-y-scroll">
      {/* Event Image */}
      {event.promoImage?.asset?.url && (
        <Image
          src={event.promoImage.asset.url}
          alt={event.name}
          width={800}
          height={450}
          className="rounded-lg shadow-md"
        />
      )}

      {/* Event Title */}
      <h1 className="text-3xl font-bold">{event.name}</h1>

      {/* Trending Badge */}
      {event.trending && (
        <span className="bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-md">
          🔥 En Tendencia
        </span>
      )}

      {/* Description */}
      <p className="text-gray-700">{event.description}</p>

      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-semibold">Categorías:</h3>
        <div className="flex gap-2">
          {event.categories?.map((category: string | number, index: Key | null | undefined) => {
            const categoryData = categoryMap[category];
            return (
              categoryData && (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${categoryData.color}`}
                >
                  {categoryData.label}
                </span>
              )
            );
          })}
        </div>
      </div>

      {/* Dates Section */}
      <div>
        <h3 className="text-lg font-semibold">Fechas:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {event.dates?.map((date, index) => (
            <li key={index}>
              <strong>{formatDateInSpanish(date.start)}</strong> - <strong>{formatDateInSpanish(date.end)}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Precio:</h3>
        {event.priceRange ? (
          <p>
            ${event.priceRange.minPrice} - ${event.priceRange.maxPrice}
          </p>
        ) : (
          <p>Free</p>
        )}
      </div>

      {/* Location */}
      {event.location && (
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
          <Link
            href={`/locations/${event.location._id}`}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {event.location.name}
          </Link>
        </div>
      )}

      {/* Add to Calendar Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Añadir al Calendario:</h3>
        <AddToCalendar dates={eventDates} title={event.name} description={event.description}/>
      </div>

      {/* Share Button */}
      <ShareButtons url={`/events/${event._id}`} title={event.name} />
    </div>
  );
}

export default EventPage;