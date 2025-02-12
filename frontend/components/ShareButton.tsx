"use client";
import { useEffect, useState } from "react";

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Share
        </button>
      ) : (
        <>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            WhatsApp
          </a>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
