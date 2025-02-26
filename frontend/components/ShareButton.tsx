"use client";
import { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    setIsMobile(!!navigator.share);
    setFullUrl(`${window.location.origin}${url}`); // Construct full URL
  }, [url]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
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
          <FaShare className="h-5 w-5" />
          <span>Compartir</span>
        </button>
      ) : (
        <>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg"
          >
            <FaShare className="h-5 w-5" />
            <span>Twitter</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            <FaShare className="h-5 w-5" />
            <span>Facebook</span>
          </a>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
