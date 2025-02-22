
import Image from "next/image";
import sanityClient from "@/lib/sanity";
import { EventType } from "@/types/event";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/20/solid";
import AddToCalendar from "@/components/AddToCalendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { categoryMap } from "@/utils/categoryMap";
import { Key } from "react";

// Fetch event data from Sanity
async function fetchEvent(id: string): Promise<EventType | null> {
  const query = `*[_type == "event" && _id == $id][0]{
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

  return await sanityClient.fetch(query, { id });
}

const formatDateInSpanish = (dateString: string) => {
  return format(new Date(dateString), "d 'de' MMMM yyyy, HH:mm", { locale: es });
};

export default async function EventPage({ params }: { params: { id: string | string[] | undefined } }) {
  // Safely handle params.id
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Check for undefined id
  if (!id) {
    return notFound();
  }

  // Fetch event data
  const event = await fetchEvent(id);

  if (!event) return notFound();

  const eventDates = event.dates || [];

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 pt-20">
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
          <MapPinIcon className="h-5 w-5 text-gray-500" />
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
    </div>
  );
}

