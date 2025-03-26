import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Star, Plus, Check, Share, ArrowLeft, Clock } from "lucide-react";
import { Movie } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentSlider from "@/components/ContentSlider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMovieById, fetchAllMovies } from "@/services/api";
import { toast } from "sonner";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInMyList, setIsInMyList] = useState(false);

  const { data: movie, isLoading: isLoadingMovie, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id as string),
    enabled: !!id,
  });

  const { data: allMovies = [] } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchAllMovies,
  });

  useEffect(() => {
    if (user && movie) {
      try {
        const storageKey = `streamify-mylist-${user.id}`;
        const savedList = localStorage.getItem(storageKey);
        
        if (savedList) {
          const parsedList = JSON.parse(savedList);
          setIsInMyList(parsedList.some((item: Movie) => item.id === movie.id));
        } else {
          setIsInMyList(false);
        }
      } catch (error) {
        console.error("Error checking my list:", error);
        setIsInMyList(false);
      }
    } else {
      setIsInMyList(false);
    }
  }, [user, movie]);

  const similarMovies = movie 
    ? allMovies.filter(
        (m: Movie) => 
          m.id !== movie.id && 
          m.genres.some((genre: string) => movie.genres.includes(genre))
      ).slice(0, 10)
    : [];

  const addToMyList = (movie: Movie) => {
    if (!user) {
      toast.error("Please sign in to add to your list");
      return;
    }
    
    try {
      const storageKey = `streamify-mylist-${user.id}`;
      const savedList = localStorage.getItem(storageKey);
      let myList: Movie[] = [];
      
      if (savedList) {
        myList = JSON.parse(savedList);
      }
      
      if (myList.some(item => item.id === movie.id)) {
        toast("This movie is already in your list");
        return;
      }
      
      const updatedList = [movie, ...myList];
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      setIsInMyList(true);
      toast.success("Added to My List");
    } catch (error) {
      console.error("Error adding to my list:", error);
      toast.error("Failed to add to your list");
    }
  };

  const removeFromMyList = (movieId: string) => {
    if (!user) {
      toast.error("Please sign in to modify your list");
      return;
    }
    
    try {
      const storageKey = `streamify-mylist-${user.id}`;
      const savedList = localStorage.getItem(storageKey);
      
      if (!savedList) {
        return;
      }
      
      const myList = JSON.parse(savedList);
      const updatedList = myList.filter((item: Movie) => item.id !== movieId);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      setIsInMyList(false);
      toast.success("Removed from My List");
    } catch (error) {
      console.error("Error removing from my list:", error);
      toast.error("Failed to remove from your list");
    }
  };

  const handleMyListToggle = () => {
    if (!movie) return;
    
    if (isInMyList) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  if (isLoadingMovie) {
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

  if (error || !movie) {
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

      <main className="pt-20">
        <div className="relative h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/80 to-transparent z-10" />
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-4 z-30 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="relative z-20 flex items-end h-full page-container pb-16 pt-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="hidden md:block w-64 overflow-hidden rounded-md shadow-lg animate-fade-in">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>

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
                    onClick={handleMyListToggle}
                  >
                    {isInMyList ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>In My List</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>My List</span>
                      </>
                    )}
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
