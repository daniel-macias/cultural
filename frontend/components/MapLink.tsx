"use client";

import { useEffect, useState } from "react";

interface MapLinkProps {
  lat: number;
  lng: number;
}
//TODO: Maybe later make this a more generic component for more links but idk
const MapLink: React.FC<MapLinkProps> = ({ lat, lng }) => {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://maps.google.com/maps?daddr=${lat},${lng}` 
      : `https://www.google.com/maps?q=${lat},${lng}`; 
    setMapUrl(url);
  }, [lat, lng]);

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
    >
      Abrir en Google Maps
    </a>
  );
};

export default MapLink;
