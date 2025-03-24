
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Filter } from "lucide-react";
import { searchMovies, Movie } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const searchResults = searchMovies(query);
        setResults(searchResults);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Search Results for "${query}"` : "Search Movies"}
            </h1>
            <p className="text-white/60">
              {loading
                ? "Searching..."
                : results.length === 0
                ? "No results found"
                : `Found ${results.length} results`}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xl mb-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const searchQuery = formData.get("search") as string;
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <input
                type="text"
                name="search"
                defaultValue={query}
                placeholder="Search for movies, TV shows, genres..."
                className="w-full py-3 px-12 bg-streamify-gray text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              <span>Filters:</span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-streamify-gray hover:bg-streamify-lightgray rounded-full text-sm transition-colors">
                All
              </button>
              <button className="px-3 py-1 bg-streamify-gray hover:bg-streamify-lightgray rounded-full text-sm transition-colors">
                Movies
              </button>
              <button className="px-3 py-1 bg-streamify-gray hover:bg-streamify-lightgray rounded-full text-sm transition-colors">
                TV Shows
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white/60">Searching...</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchIcon className="w-16 h-16 text-white/20 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-white/60 text-center max-w-md mb-6">
                We couldn't find any matches for "{query}". Please try a different search term or browse our categories.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition-colors"
              >
                Browse All Content
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="animate-fade-in"
                >
                  <MovieCard movie={movie} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
