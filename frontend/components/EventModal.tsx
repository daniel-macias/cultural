
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { XMarkIcon, ArrowRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import ShareButtons from "@/components/ShareButton";
import { categoryMap } from "@/utils/categoryMap";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  active: any;
}

const formatDates = (dates: any[]) => {
    return dates.map((date: any, index: number) => {
      const start = new Date(date.start);
      const end = new Date(date.end);
      const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = start.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      return (
        <div key={index} className="mb-2">
          <div className="text-lg font-semibold">{dateStr}</div>
          <div className="text-sm text-gray-600">{`${startTime} - ${endTime}`}</div>
        </div>
      );
    });
  };

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, active }) => {
  if (!active) return null; // Handle case when there is no event

  return (
    <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{active.name}</h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          

          {active.promoImage?.asset?.url && (
            <div className="w-full h-48 relative mb-4">
              <Image
                src={active.promoImage.asset.url}
                alt={active.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto text-gray-700 p-2">
            <p className="text-lg">{active.description}</p>
          </div>

          {/* Display event dates */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Fechas</h3>
            {formatDates(active.dates)}
          </div>

          {/* Location */}
          {active.location && (
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-gray-600" />
              <Link
                href={`/locations/${active.location._id}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg transition duration-200 hover:bg-blue-600 hover:text-white"
              >
                {active.location.name}
              </Link>
            </div>
          )}

          {/* Categories */}
          <div className="mb-4 mt-4">
            <h3 className="text-xl font-semibold">Categorías</h3>
            <div className="flex gap-2">
              {active.categories?.map((category: string) => (
                <span
                  key={category}
                  className={`px-3 py-1 rounded-full ${categoryMap[category]?.color || "bg-gray-300 text-black"}`}
                >
                  {categoryMap[category]?.label || category}
                </span>
              ))}
            </div>
          </div>

          {/* Price Range */}
          {active.priceRange && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Precios</h3>
              <p>{`$${active.priceRange.minPrice} - $${active.priceRange.maxPrice}`}</p>
            </div>
          )}

        <div className="flex justify-between items-center mt-4">
          {/* Ver Más Button */}
          <Link
            href={`/events/${active._id}`}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2"
          >
            <span>Ver Más</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>

          {/* Share Button */}
          <ShareButtons url={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${active._id}`} title={active.name} />
        </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default EventModal;
