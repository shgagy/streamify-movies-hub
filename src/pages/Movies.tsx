
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { movies, genres, getMoviesByGenre } from "@/lib/mockData";

const Movies: React.FC = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  
  // Filter movies based on selected genre
  const filteredMovies = useMemo(() => 
    selectedGenreId ? getMoviesByGenre(selectedGenreId) : movies,
    [selectedGenreId]
  );

  // Get selected genre name for display
  const selectedGenreName = useMemo(() => 
    selectedGenreId ? genres.find(g => g.id === selectedGenreId)?.name || "Movies" : "All Movies",
    [selectedGenreId]
  );

  const handleGenreSelect = (genreId: string | null) => {
    setSelectedGenreId(genreId);
  };

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6">Movies</h1>
          
          {/* Genre Filter */}
          <div className="mb-8" data-section="genres">
            <h2 className="text-xl font-medium mb-4">Browse by Genre</h2>
            <GenreFilter 
              selectedGenreId={selectedGenreId}
              onSelectGenre={handleGenreSelect}
            />
          </div>

          {/* Movies Grid Layout */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">{selectedGenreName}</h2>
            
            {filteredMovies.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-400">No movies found for this genre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="animate-fade-in">
                    <MovieCard movie={movie} layout="poster" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
