import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const GifPicker = ({ onGifSelect, className = "" }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);

  // Trending/popular GIFs for initial display
  const trendingGifs = [
    {
      id: "trending-1",
      url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
      title: "Love",
    },
    {
      id: "trending-2",
      url: "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif",
      title: "Dancing",
    },
    {
      id: "trending-3",
      url: "https://media.giphy.com/media/l0MYzLLxlJDfYtzy0/giphy.gif",
      title: "Happy",
    },
    {
      id: "trending-4",
      url: "https://media.giphy.com/media/26BROccNKPzOYO6yY/giphy.gif",
      title: "Excited",
    },
    {
      id: "trending-5",
      url: "https://media.giphy.com/media/3o6Zt2qJM9jdbs8Wd2/giphy.gif",
      title: "Kiss",
    },
    {
      id: "trending-6",
      url: "https://media.giphy.com/media/l0HlNQ03J5JmEtmFO/giphy.gif",
      title: "Wink",
    },
    {
      id: "trending-7",
      url: "https://media.giphy.com/media/26AHwRW5cVPjjsOVq/giphy.gif",
      title: "Thumbs Up",
    },
    {
      id: "trending-8",
      url: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
      title: "Heart",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPicker && !searchTerm) {
      setGifs(trendingGifs);
    }
  }, [showPicker]);

  const searchGifs = async (query) => {
    if (!query.trim()) {
      setGifs(trendingGifs);
      return;
    }

    setLoading(true);
    try {
      // Since we can't use real GIPHY API without API key, we'll simulate search with filtered trending GIFs
      const filtered = trendingGifs.filter((gif) =>
        gif.title.toLowerCase().includes(query.toLowerCase())
      );

      // Add some mock search results
      const mockResults = [
        {
          id: `search-${query}-1`,
          url: "https://media.giphy.com/media/l0MYGb8Q5nw3n8Jm8/giphy.gif",
          title: query,
        },
        {
          id: `search-${query}-2`,
          url: "https://media.giphy.com/media/26BRvQhSg2j3xh2bS/giphy.gif",
          title: query,
        },
        {
          id: `search-${query}-3`,
          url: "https://media.giphy.com/media/3o7TKxgNFDI3SUbBRK/giphy.gif",
          title: query,
        },
      ];

      setGifs([...filtered, ...mockResults]);
    } catch (error) {
      console.error("Error searching GIFs:", error);
      setGifs(trendingGifs);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchGifs(searchTerm);
  };

  const handleGifClick = (gif) => {
    onGifSelect(gif.url, gif.title);
    setShowPicker(false);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        aria-label="Add GIF"
      >
        <span className="text-sm font-bold">GIF</span>
      </button>

      {showPicker && (
        <div className="absolute bottom-full mb-2 left-0 w-80 h-96 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choose a GIF
              </h3>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for GIFs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* GIF Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => handleGifClick(gif)}
                    className="relative group aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={gif.url}
                      alt={gif.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded">
                        {gif.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && gifs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-4xl mb-2">🔍</span>
                <p className="text-gray-500 dark:text-gray-400">
                  No GIFs found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GifPicker;
