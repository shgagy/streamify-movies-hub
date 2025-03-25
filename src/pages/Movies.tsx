
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentSlider from "@/components/ContentSlider";
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

          {/* Movies Content */}
          <div className="mt-8">
            <ContentSlider
              title={selectedGenreName}
              movies={filteredMovies}
              layout="poster"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
