import { notFound } from "next/navigation";
import sanityClient from "@/lib/sanity";
import Map from "@/components/Map";
import MapLink from "@/components/MapLink";

interface LocationType {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

async function fetchLocation(id: string): Promise<LocationType | null> {
  const query = `*[_type == "location" && _id == $id][0]{
    name,
    address,
    coordinates
  }`;
  return await sanityClient.fetch(query, { id });
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Await the params
  const location = await fetchLocation(resolvedParams.id); // Now safely use the ID

  if (!location) return notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6  pt-20">
      <h1 className="text-3xl font-bold">{location.name}</h1>
      <p className="text-gray-700">{location.address}</p>

      <div style={{ height: "400px", width: "100%" }}>
        <Map coordinates={location.coordinates} />
      </div>

      <MapLink lat={location.coordinates.lat} lng={location.coordinates.lng} />
    </div>
  );
}
