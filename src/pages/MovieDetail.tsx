import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Star, Plus, Check, Share, Clock } from "lucide-react";
import { Movie } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentSlider from "@/components/ContentSlider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMovieById, fetchAllMovies } from "@/services/api";
import { toast } from "sonner";
import { useResponsive } from "@/hooks/useResponsive";

const MovieDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [isInMyList, setIsInMyList] = useState(false);
  const {
    isMdUp
  } = useResponsive();
  const {
    data: movie,
    isLoading: isLoadingMovie,
    error
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id as string),
    enabled: !!id
  });
  const {
    data: allMovies = []
  } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchAllMovies
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

  const similarMovies = movie ? allMovies.filter((m: Movie) => m.id !== movie.id && m.genres.some((genre: string) => movie.genres.includes(genre))).slice(0, 10) : [];

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
    return <div className="min-h-screen bg-streamify-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white/60">Loading...</p>
          </div>
        </div>
      </div>;
  }

  if (error || !movie) {
    return <div className="min-h-screen bg-streamify-black text-white">
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
      </div>;
  }

  return <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />

      <main className="pt-0">
        <div className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-streamify-black to-transparent/0 z-20 h-36" />
            <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover object-center" />
          </div>

          <div className="relative z-20 flex items-end h-full page-container pb-16 pt-36">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start w-full max-w-full overflow-hidden mt-8 md:mt-10">
              {isMdUp && <div className="w-36 md:w-48 overflow-hidden rounded-md shadow-lg animate-fade-in shrink-0">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
                </div>}

              {!isMdUp && <div className="w-32 overflow-hidden rounded-md shadow-lg animate-fade-in mb-4">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto object-scale-down" />
                </div>}

              <div className="max-w-xl md:max-w-[55%] animate-fade-in overflow-hidden">
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3 justify-center md:justify-start">
                  {movie.genres.slice(0, isMdUp ? 3 : 2).map((genre, index) => <span key={index} className="px-2 md:px-2.5 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-xs whitespace-nowrap">
                      {genre}
                    </span>)}
                </div>

                <h1 className="md:text-2xl mb-2 md:mb-3 text-center md:text-left truncate text-2xl font-bold">
                  {movie.title}
                </h1>

                <div className="flex items-center text-xs mb-3 md:mb-4 text-white/80 justify-center md:justify-start">
                  <span className="mr-4">{movie.releaseYear}</span>
                  <span className="mr-4 flex items-center">
                    <Star className="w-3.5 h-3.5 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-bold mr-1">{movie.rating.toFixed(1)}</span>/10
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {movie.duration}
                  </span>
                </div>

                <p className="text-white/90 mb-4 md:mb-5 text-center md:text-left line-clamp-3 md:line-clamp-2 font-normal md:text-sm text-base">
                  {movie.description}
                </p>

                {isMdUp && <>
                    <div className="mb-2 md:mb-3">
                      <p className="text-white/60 mb-0.5 text-xs">Director:</p>
                      <p className="font-medium truncate text-xs">{movie.director}</p>
                    </div>

                    <div className="mb-4 md:mb-6">
                      <p className="text-white/60 mb-0.5 text-xs">Cast:</p>
                      <p className="font-medium line-clamp-1 text-xs">{movie.cast.join(", ")}</p>
                    </div>
                  </>}

                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md flex items-center space-x-1.5">
                    <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-sm">Play</span>
                  </Button>

                  <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md flex items-center space-x-1.5" onClick={handleMyListToggle}>
                    {isInMyList ? <>
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="text-sm">In My List</span>
                      </> : <>
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="text-sm">My List</span>
                      </>}
                  </Button>

                  <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-1.5 md:p-2 rounded-full">
                    <Share className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {movie.trailerUrl && <div className="py-10 md:py-16 page-container">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Trailer</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-streamify-gray">
              <iframe width="100%" height="100%" src={movie.trailerUrl.replace("watch?v=", "embed/")} title={`${movie.title} Trailer`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
            </div>
          </div>}

        {similarMovies.length > 0 && <ContentSlider title="You May Also Like" movies={similarMovies} />}
      </main>

      <Footer />
    </div>;
};

export default MovieDetail;
