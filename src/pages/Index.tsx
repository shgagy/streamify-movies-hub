
import React, { useState } from "react";
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

  // Get movies by selected genre or all movies if no genre is selected
  const filteredMovies = selectedGenreId 
    ? getMoviesByGenre(selectedGenreId)
    : movies;

  // Get movies by genre for each slider
  const getGenreMovies = (genreId: string) => {
    return getMoviesByGenre(genreId);
  };

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
                onClick={() => navigate("/my-list")}
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
            onSelectGenre={setSelectedGenreId}
          />
        </div>
        
        {/* Movies filtered by selected genre */}
        {selectedGenreId ? (
          <ContentSlider 
            title={genres.find(g => g.id === selectedGenreId)?.name || "Movies"} 
            movies={filteredMovies} 
          />
        ) : (
          <>
            {/* Trending Movies */}
            <ContentSlider title="Trending Now" movies={movies} />
            
            {/* Top Rated Movies */}
            <ContentSlider
              title="Top Rated Movies"
              movies={[...movies].sort((a, b) => b.rating - a.rating)}
              layout="backdrop"
            />
            
            {/* Genre-based Recommendations */}
            {genres.slice(0, 3).map((genre) => {
              const genreMovies = getGenreMovies(genre.id);
              if (genreMovies.length) {
                return (
                  <ContentSlider 
                    key={genre.id} 
                    title={genre.name} 
                    movies={genreMovies} 
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
