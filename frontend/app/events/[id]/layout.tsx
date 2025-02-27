import sanityClient from "@/lib/sanity";
import { EventType } from "@/types/event";
import { Metadata } from "next";

// LayoutProps now expects params to be a promise
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Ensure this is a Promise
};

async function fetchEvent(id: string): Promise<EventType | null> {
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

  return await sanityClient.fetch(query, { id });
}

// Updated generateMetadata function
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params; // Resolve the params promise
  const event = await fetchEvent(resolvedParams.id); // Use the resolved id

  if (!event) {
    return {
      title: "Evento no encontrado",
      description: "Este evento no está disponible.",
    };
  }

  return {
    title: `${event.name} | Recorriendo el Cerro`,
    description: event.description?.slice(0, 150) || "Evento en Tegucigalpa.",
    openGraph: {
      title: event.name,
      description: event.description?.slice(0, 150) || "Evento en Tegucigalpa.",
      url: `https://recorriendoelcerro.com/events/${event._id}`,
      type: "article",
      images: [
        {
          url: event.promoImage?.asset?.url || "https://recorriendoelcerro.com/default-og.jpg",
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  };
}

// Layout component remains the same
export default function EventLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
