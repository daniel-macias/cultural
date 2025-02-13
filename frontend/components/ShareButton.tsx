"use client";
import { useEffect, useState } from "react";
import { ShareIcon } from "@heroicons/react/24/solid";

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div className="flex space-x-4">
      {isMobile ? (
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          <ShareIcon className="h-5 w-5" />
          <span>Compartir</span>
        </button>
      ) : (
        <>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Twitter</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Facebook</span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            <ShareIcon className="h-5 w-5" />
            <span>WhatsApp</span>
          </a>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
