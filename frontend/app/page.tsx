import sanityClient from "@/lib/sanity";

async function fetchEvents() {
  const query = '*[_type == "event"]'; // Fetch all events
  const events = await sanityClient.fetch(query);
  return events;
}

export default async function Page() {
  const events = await fetchEvents();  // Fetch events from Sanity

  return (
    <div>
      <h1>Events in Tegucigalpa</h1>
      <ul>
        {events.map((event: any) => (
          <li key={event._id}>
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.dateTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}