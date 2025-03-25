
import React, { useState, useCallback, useMemo } from "react";
import Hero from "@/components/Hero";
import ContentSlider from "@/components/ContentSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Welcome from "@/components/Welcome";
import GenreFilter from "@/components/GenreFilter";
import { movies, genres, getMoviesByGenre } from "@/lib/mockData";
import { useMyList } from "@/contexts/MyListContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const { myList } = useMyList();
  const navigate = useNavigate();

  // Memoize filtered movies to prevent unnecessary recalculation
  const filteredMovies = useMemo(() => 
    selectedGenreId ? getMoviesByGenre(selectedGenreId) : movies,
    [selectedGenreId]
  );

  // Memoize genre name for display
  const selectedGenreName = useMemo(() => 
    selectedGenreId ? genres.find(g => g.id === selectedGenreId)?.name || "Movies" : null,
    [selectedGenreId]
  );

  // Optimize genre selection handler
  const handleGenreSelect = useCallback((genreId: string | null) => {
    setSelectedGenreId(genreId);
  }, []);

  // Navigate to My List page
  const navigateToMyList = useCallback(() => {
    navigate("/my-list");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />
        
        {/* Welcome Banner for First-time Visitors */}
        <div className="page-container mt-8">
          <Welcome />
        </div>
        
        {/* My List (if not empty) */}
        {myList.length > 0 && (
          <div className="my-8">
            <div className="page-container flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My List</h2>
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-white flex items-center"
                onClick={navigateToMyList}
              >
                See All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <ContentSlider 
              title="" 
              movies={myList} 
            />
          </div>
        )}
        
        {/* Genre Filter */}
        <div className="page-container mt-8 mb-4" data-section="genres">
          <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
          <GenreFilter 
            selectedGenreId={selectedGenreId}
            onSelectGenre={handleGenreSelect}
          />
        </div>
        
        {/* Movies filtered by selected genre */}
        {selectedGenreId ? (
          <ContentSlider 
            title={selectedGenreName || "Movies"} 
            movies={filteredMovies} 
          />
        ) : (
          <>
            {/* Trending Movies */}
            <ContentSlider title="Trending Now" movies={movies} />
            
            {/* Top Rated Movies */}
            <ContentSlider
              title="Top Rated Movies"
              movies={useMemo(() => [...movies].sort((a, b) => b.rating - a.rating), [])}
              layout="backdrop"
            />
            
            {/* Genre-based Recommendations */}
            {genres.slice(0, 3).map((genre) => (
              <ContentSlider 
                key={genre.id} 
                title={genre.name} 
                movies={getMoviesByGenre(genre.id)} 
              />
            ))}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
