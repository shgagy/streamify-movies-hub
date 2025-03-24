
import React from "react";
import Hero from "@/components/Hero";
import ContentSlider from "@/components/ContentSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { movies, genres, getMoviesByGenre } from "@/lib/mockData";
import { useMyList } from "@/contexts/MyListContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  // Get movies by genre for each slider
  const getGenreMovies = (genreId: string) => {
    return getMoviesByGenre(genreId);
  };

  const { myList } = useMyList();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />
        
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
