"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sanityClient from "@/lib/sanity";
import { EventType } from "@/types/event";

export default function EventPage() {
  const { id } = useParams(); 
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    async function fetchEvent() {
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
          name,
          address
        },
        trending
      }`;
      const data = await sanityClient.fetch(query, { id });
      setEvent(data);
    }
    if (id) fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {event.promoImage?.asset?.url && (
        <Image
          src={event.promoImage.asset.url}
          alt={event.name}
          width={600}
          height={300}
          className="rounded-lg"
        />
      )}
      <h1 className="text-2xl font-bold mt-4">{event.name}</h1>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <p className="text-green-600 font-semibold mt-2">
        {event.priceRange ? `$${event.priceRange.minPrice} - $${event.priceRange.maxPrice}` : "Free"}
      </p>
      {event.dates && event.dates.length > 0 && (
        <ul className="mt-4">
          {event.dates.map((date, index) => (
            <li key={index} className="text-sm text-gray-500">
              📅 {new Date(date.start).toLocaleString("es-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
