'use client';

import { useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AddToCalendarProps {
  title: string;
  description?: string;
  location?: string;
  dates: Array<{
    start: string;
    end: string;
  }>;
}

const AddToCalendar = ({ title, description = '', location = '', dates }: AddToCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated format function to display dates in Spanish
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: es });
  };

  const addToCalendarLink = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startISO = startDate.toISOString().replace(/-|:|\.\d+/g, "");
    const endISO = endDate.toISOString().replace(/-|:|\.\d+/g, "");
  
    // Encode the description and location to make sure they're URL-safe
    const encodedDescription = encodeURIComponent(description || '');
    const encodedLocation = encodeURIComponent(location || '');

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodedDescription}&location=${encodedLocation}&dates=${startISO}/${endISO}`;

    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodedDescription}&location=${encodedLocation}&startdt=${startISO}&enddt=${endISO}`;
  
    const appleCalendarUrl = `https://calendar.apple.com/event?title=${encodeURIComponent(title)}&details=${encodedDescription}&location=${encodedLocation}&start=${startISO}&end=${endISO}`;
  
    return {
      google: googleCalendarUrl,
      outlook: outlookCalendarUrl,
      apple: appleCalendarUrl,
    };
  };
  

  return (
    <div className="space-y-4">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="h-5 w-5" />
        <span>Agregar al Calendario</span>
        <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="space-y-2 mt-2 max-h-96 overflow-y-auto transition-all ease-in-out duration-300">
          {dates.map((date, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm text-gray-600">
                {formatDate(date.start)} - {formatDate(date.end)}
              </p>
              <div className="flex space-x-4"> {/* Flex layout here */}
                {/* Google Calendar Button */}
                <a
                  href={addToCalendarLink(date.start, date.end).google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Google Calendar
                </a>
                {/* Outlook Calendar Button */}
                <a
                  href={addToCalendarLink(date.start, date.end).outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Outlook Calendar
                </a>
                {/* Apple Calendar Button */}
                <a
                  href={addToCalendarLink(date.start, date.end).apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Apple Calendar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToCalendar;
