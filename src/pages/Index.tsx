
import React from "react";
import Hero from "@/components/Hero";
import ContentSlider from "@/components/ContentSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { movies, genres, getMoviesByGenre } from "@/lib/mockData";

const Index: React.FC = () => {
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
