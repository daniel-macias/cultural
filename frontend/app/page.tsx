import sanityClient from "@/lib/sanity";
import Image from "next/image";

async function fetchEvents() {
  const query = `*[_type == "event"]{
    _id,
    name,
    description,
    dates,
    promoImage{
      asset->{url}
    },
    categories
  }`;
  return await sanityClient.fetch(query);
}

export default async function Page() {
  const events = await fetchEvents();

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">Events in Tegucigalpa</h1>
        <div className="space-y-6">
          {events.map((event: any) => (
            <div key={event._id} className="bg-white p-6 rounded-lg shadow-md">
              {event.promoImage?.asset?.url && (
                <div className="w-full h-48 relative">
                  <Image
                    src={event.promoImage.asset.url}
                    alt={event.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl font-semibold mt-4 text-slate-900">{event.name}</h2>
              <p className="text-gray-700 mt-2">{event.description}</p>
              
              {/* Display Dates */}
              <div className="mt-3">
                <h3 className="text-lg font-medium text-slate-700">Dates:</h3>
                <ul className="list-disc ml-5 text-gray-600">
                  {event.dates?.map((date: any, index: number) => (
                    <li key={index}>
                      {new Date(date.start).toLocaleString()} - {new Date(date.end).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Display Categories (Tags) */}
              {event.categories && (
                <div className="mt-3">
                  <h3 className="text-lg font-medium">Categories:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.categories.map((category: string, index: number) => (
                      <span key={index} className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
