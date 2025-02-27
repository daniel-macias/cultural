import React from 'react';

export default function EventSkeleton() {
  return (
    <div className="animate-pulse p-6 max-w-lg mx-auto space-y-4 rounded-lg">
      {/* Image Placeholder */}
      <div className="mt-10 h-48 bg-gray-300 rounded-md"></div>

      {/* Title Placeholder */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>

      {/* Description Placeholder */}
      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>

      {/* Buttons Placeholder */}
      <div className="flex justify-center space-x-4">
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}
