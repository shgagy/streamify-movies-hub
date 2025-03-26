
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContentSlider from "@/components/ContentSlider";
import Welcome from "@/components/Welcome";
import { fetchTrendingMovies, fetchPopularMovies, fetchAllMovies, fetchPopularTVShows } from "@/services/api";
import { Movie } from "@/lib/mockData";

const Index: React.FC = () => {
  // Fetch trending, popular, and all movies
  const { data: trendingMovies = [], isLoading: loadingTrending } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: fetchTrendingMovies
  });

  const { data: popularMovies = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: fetchPopularMovies
  });

  const { data: allMovies = [], isLoading: loadingAllMovies } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchAllMovies
  });

  const { data: popularTVShows = [], isLoading: loadingPopularTVShows } = useQuery({
    queryKey: ['tvshows', 'popular'],
    queryFn: fetchPopularTVShows
  });

  // Get featured movies for the hero carousel (using top 5 popular movies)
  const featuredMovies = popularMovies.slice(0, 5);

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        {!loadingAllMovies && featuredMovies.length > 0 && (
          <Hero movies={featuredMovies} />
        )}
        
        <div className="py-6">
          {/* Welcome Message (first visit) */}
          <div className="page-container">
            <Welcome />
          </div>
          
          {/* Content Sections */}
          {loadingTrending || loadingPopular || loadingAllMovies || loadingPopularTVShows ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white/60">Loading content...</p>
              </div>
            </div>
          ) : (
            <>
              {trendingMovies.length > 0 && (
                <ContentSlider
                  title="الرائج الآن"
                  movies={trendingMovies}
                />
              )}
              
              {popularMovies.length > 0 && (
                <ContentSlider
                  title="الشائع على Streamify"
                  movies={popularMovies}
                  featured={true}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
