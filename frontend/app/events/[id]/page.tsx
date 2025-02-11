import Image from "next/image";
import sanityClient from "@/lib/sanity";
import { EventType } from "@/types/event";
import { notFound } from "next/navigation";
import Link from "next/link";

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

// Category styles
const categoryMap: Record<string, { label: string; color: string }> = {
  musica: { label: "Música", color: "bg-blue-500 text-white" },
  teatro: { label: "Teatro", color: "bg-purple-500 text-white" },
  tecnologia: { label: "Tecnología", color: "bg-green-500 text-white" },
  deporte: { label: "Deporte", color: "bg-red-500 text-white" },
  infantil: { label: "Infantil", color: "bg-yellow-500 text-black" },
  moda: { label: "Moda", color: "bg-pink-500 text-white" },
  arte: { label: "Arte", color: "bg-indigo-500 text-white" },
  feria: { label: "Feria", color: "bg-orange-500 text-white" },
  concierto: { label: "Concierto", color: "bg-teal-500 text-white" },
  gastronomico: { label: "Gastronómico", color: "bg-amber-500 text-black" },
  politico: { label: "Político", color: "bg-gray-700 text-white" },
};

export default async function EventPage({ params }: { params: { id: string } }) {
  // Await the params before using them
  const { id } = await params;

  // Fetch event data
  const event = await fetchEvent(id);

  if (!event) return notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
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
          {event.categories?.map((category, index) => {
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
              <strong>{date.start}</strong> to <strong>{date.end}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Price:</h3>
        {event.priceRange ? (
          <p>
            ${event.priceRange.minPrice} - ${event.priceRange.maxPrice}
          </p>
        ) : (
          <p>Free</p>
        )}
      </div>

      {/* Location Button */}
      {event.location && (
        <Link
          href={`/locations/${event.location._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
        >
          Ver Ubicación
        </Link>
      )}
    </div>
  );
}
