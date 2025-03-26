
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

  // Create a sample of recent releases (using all movies, sorted by releaseYear)
  const recentReleases = [...allMovies]
    .sort((a: Movie, b: Movie) => b.releaseYear - a.releaseYear)
    .slice(0, 10);

  // Get featured movies for the hero carousel (using top 5 popular movies)
  const featuredMovies = popularMovies.slice(0, 5);

  // Get 10 popular movies for the featured movies section with autoplay
  const featuredMoviesForSlider = popularMovies.slice(0, 10);

  // Create a sample of anime (filtering movies that have "Animation" or "Anime" in genres)
  const animeMovies = allMovies
    .filter((movie: Movie) => 
      movie.genres.some(genre => 
        genre.toLowerCase().includes('animation') || 
        genre.toLowerCase().includes('anime')
      )
    )
    .sort((a: Movie, b: Movie) => b.releaseYear - a.releaseYear)
    .slice(0, 10);

  // Featured series from TV shows
  const featuredSeries = popularTVShows.slice(0, 10);

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        {!loadingAllMovies && featuredMovies.length > 0 && (
          <Hero movies={featuredMovies} />
        )}
        
        <div className="py-10">
          {/* Welcome Message (first visit) */}
          <div className="page-container">
            <Welcome />
          </div>
          
          {/* Content Sliders */}
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
                  title="Trending Now"
                  movies={trendingMovies}
                  useDotNavigation={true}
                  autoPlay={false}
                  showArrows={false}
                />
              )}
              
              {popularMovies.length > 0 && (
                <ContentSlider
                  title="Popular on Streamify"
                  movies={popularMovies}
                  useDotNavigation={false}
                  autoPlay={false}
                  showArrows={false}
                />
              )}
              
              {/* New section: Recently Added Anime */}
              {animeMovies.length > 0 && (
                <ContentSlider
                  title="Recently Added Anime"
                  movies={animeMovies}
                  useDotNavigation={false}
                  autoPlay={false}
                  showArrows={false}
                />
              )}
              
              {/* New section: Featured Series */}
              {featuredSeries.length > 0 && (
                <ContentSlider
                  title="Featured Series"
                  movies={featuredSeries}
                  useDotNavigation={false}
                  autoPlay={false}
                  showArrows={false}
                />
              )}
              
              {/* Updated: Featured Movies with autoplay and dot navigation */}
              {featuredMoviesForSlider.length > 0 && (
                <ContentSlider
                  title="Featured Movies"
                  movies={featuredMoviesForSlider}
                  layout="backdrop"
                  autoPlay={true}
                  interval={8000}
                  useDotNavigation={true}
                  showArrows={false}
                />
              )}
              
              {recentReleases.length > 0 && (
                <ContentSlider
                  title="Recent Releases"
                  movies={recentReleases}
                  useDotNavigation={true}
                  autoPlay={false}
                  showArrows={false}
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
