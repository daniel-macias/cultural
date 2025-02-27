import React from 'react'

export default function EventSkeleton() {
    return (
        <div className="animate-pulse p-6 space-y-4 bg-gray-200 rounded-lg">
            <div className="h-48 bg-gray-300 rounded-md"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      );
}
