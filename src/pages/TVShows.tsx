
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { fetchAllTVShows, fetchTVShowsByGenre, fetchAllGenres } from "@/services/api";
import { TVShow } from "@/lib/mockData";
import { TVShowDocument } from "@/services/mongodb/models/types";

const TVShows: React.FC = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  
  // Fetch all genres
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchAllGenres
  });
  
  // Fetch TV shows based on selected genre
  const { data: tvShows = [], isLoading } = useQuery({
    queryKey: ['tvshows', selectedGenreId],
    queryFn: () => selectedGenreId ? fetchTVShowsByGenre(selectedGenreId) : fetchAllTVShows(),
  });
  
  // Get selected genre name for display
  const selectedGenreName = selectedGenreId 
    ? genres.find((g: any) => g.id === selectedGenreId)?.name || "TV Shows" 
    : "All TV Shows";

  const handleGenreSelect = (genreId: string | null) => {
    setSelectedGenreId(genreId);
  };

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6">TV Shows</h1>
          
          {/* Genre Filter */}
          <div className="mb-8" data-section="genres">
            <h2 className="text-xl font-medium mb-4">Browse by Genre</h2>
            <GenreFilter 
              selectedGenreId={selectedGenreId}
              onSelectGenre={handleGenreSelect}
            />
          </div>

          {/* TV Shows Grid Layout */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">{selectedGenreName}</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-white/60">Loading TV shows...</p>
                </div>
              </div>
            ) : tvShows.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-400">No TV shows found for this genre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {tvShows.map((tvShow: TVShowDocument) => (
                  <div key={tvShow.id} className="animate-fade-in">
                    <MovieCard movie={tvShow as unknown as TVShow} layout="poster" />
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

export default TVShows;
