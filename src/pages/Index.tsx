import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContentSlider from "@/components/ContentSlider";
import Welcome from "@/components/Welcome";
import ErrorBoundary from "@/components/ErrorBoundary";
import { fetchTrendingMovies, fetchPopularMovies, fetchAllMovies, fetchPopularTVShows } from "@/services/api";
import { Movie } from "@/lib/mockData";

// Simple error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h3 className="text-red-800 font-medium">Something went wrong:</h3>
    <p className="text-red-600 mt-1">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
    >
      Try again
    </button>
  </div>
);

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

  // Replace external image URLs with local alternatives - ALWAYS use local placeholder
  const ensureWorkingImages = (movies: Movie[]): Movie[] => {
    return movies.map(movie => ({
      ...movie,
      posterUrl: "/movie-placeholder.jpg",  // Always use local placeholder
      backdropUrl: "/movie-placeholder.jpg" // Always use local placeholder
    }));
  };

  // Apply image replacements to all movie collections
  const securedTrendingMovies = ensureWorkingImages(trendingMovies);
  const securedPopularMovies = ensureWorkingImages(popularMovies);
  const securedFeaturedMovies = ensureWorkingImages(featuredMovies);
  const securedFeaturedMoviesForSlider = ensureWorkingImages(featuredMoviesForSlider);
  const securedAnimeMovies = ensureWorkingImages(animeMovies);
  const securedFeaturedSeries = ensureWorkingImages(featuredSeries);
  const securedRecentReleases = ensureWorkingImages(recentReleases);

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        {!loadingAllMovies && securedFeaturedMovies.length > 0 && (
          <Hero movies={securedFeaturedMovies} />
        )}
        
        <div className="py-4">
          {/* Welcome Message (first visit) */}
          <div className="page-container">
            <Welcome />
          </div>
          
          {/* Content Sections */}
          {loadingTrending || loadingPopular || loadingAllMovies || loadingPopularTVShows ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white/60">Loading content...</p>
              </div>
            </div>
          ) : (
            <>
              {securedTrendingMovies.length > 0 && (
                <React.Suspense fallback={<div>Loading Trending Now...</div>}>
                  <ErrorBoundary fallback={ErrorFallback} onReset={() => {}}>
                    <ContentSlider
                      title="Trending Now"
                      movies={securedTrendingMovies}
                    />
                  </ErrorBoundary>
                </React.Suspense>
              )}
              
              {securedPopularMovies.length > 0 && (
                <ContentSlider
                  title="Popular on Streamify"
                  movies={securedPopularMovies}
                  featured={true}
                />
              )}
              
              {securedFeaturedMoviesForSlider.length > 0 && (
                <ContentSlider
                  title="Featured Movies"
                  movies={securedFeaturedMoviesForSlider}
                />
              )}
              
              {securedAnimeMovies.length > 0 && (
                <ContentSlider
                  title="Recently Added Anime"
                  movies={securedAnimeMovies}
                />
              )}
              
              {securedFeaturedSeries.length > 0 && (
                <ContentSlider
                  title="Featured Series"
                  movies={securedFeaturedSeries}
                />
              )}
              
              {securedRecentReleases.length > 0 && (
                <ContentSlider
                  title="Recent Releases"
                  movies={securedRecentReleases}
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
