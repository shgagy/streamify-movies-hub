
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Plus, Share, ArrowLeft, Clock } from "lucide-react";
import { getMovieById, movies, Movie } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentSlider from "@/components/ContentSlider";
import { Button } from "@/components/ui/button";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Simulate loading
      setLoading(true);
      setTimeout(() => {
        const foundMovie = getMovieById(id);
        setMovie(foundMovie || null);

        // Find similar movies based on genres
        if (foundMovie) {
          const similar = movies
            .filter(
              (m) =>
                m.id !== foundMovie.id &&
                m.genres.some((genre) => foundMovie.genres.includes(genre))
            )
            .slice(0, 10);
          setSimilarMovies(similar);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-streamify-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-streamify-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <p className="mb-6 text-white/60">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")} className="button-primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section with Movie Details */}
        <div className="relative h-[80vh] w-full overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/80 to-transparent z-10" />
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-30 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative z-20 flex items-end h-full page-container pb-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Movie Poster */}
              <div className="hidden md:block w-64 overflow-hidden rounded-md shadow-lg animate-fade-in">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Movie Info */}
              <div className="max-w-2xl animate-fade-in">
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {movie.title}
                </h1>

                <div className="flex items-center text-sm mb-6 text-white/80">
                  <span className="mr-4">{movie.releaseYear}</span>
                  <span className="mr-4 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-bold mr-1">{movie.rating.toFixed(1)}</span>/10
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.duration}
                  </span>
                </div>

                <p className="text-white/90 mb-8">
                  {movie.description}
                </p>

                <div className="mb-4">
                  <p className="text-white/60 mb-1">Director:</p>
                  <p className="font-medium">{movie.director}</p>
                </div>

                <div className="mb-8">
                  <p className="text-white/60 mb-1">Cast:</p>
                  <p className="font-medium">{movie.cast.join(", ")}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Play</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>My List</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-3 rounded-full"
                  >
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Trailer Section */}
        {movie.trailerUrl && (
          <div className="py-16 page-container">
            <h2 className="text-2xl font-bold mb-6">Trailer</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-streamify-gray">
              <iframe
                width="100%"
                height="100%"
                src={movie.trailerUrl.replace("watch?v=", "embed/")}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <ContentSlider
            title="You May Also Like"
            movies={similarMovies}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetail;
