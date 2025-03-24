
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { searchMovies, Movie } from "@/lib/mockData";

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = searchMovies(query);
      setResults(searchResults.slice(0, 6)); // Limit to 6 results for dropdown
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search for movies, TV shows, genres..."
            className="w-full py-3 px-12 bg-streamify-gray text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search results dropdown */}
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-streamify-darkgray rounded-md shadow-lg z-50 overflow-hidden animate-fade-in">
          <div className="divide-y divide-streamify-gray">
            {results.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center p-2 hover:bg-streamify-gray rounded-md cursor-pointer transition-colors"
                onClick={() => handleResultClick(movie.id)}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded-sm"
                />
                <div className="ml-3 flex-1">
                  <h4 className="font-medium">{movie.title}</h4>
                  <p className="text-sm text-white/60">
                    {movie.releaseYear} • {movie.genres.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full mt-2 p-2 text-center text-white/80 hover:text-white hover:bg-streamify-gray rounded-md transition-colors"
            onClick={handleSearch}
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
