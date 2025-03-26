
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { fetchMovieById, fetchTVShowById } from "@/services/api";
import { Movie, TVShow } from "@/lib/mockData";
import ContentSlider from "@/components/ContentSlider";

const Watch = () => {
  const { id, type = "movie" } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Movie | TVShow | null>(null);
  const [related, setRelated] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock video sources (in a real app these would come from a CDN)
  const videoSources = {
    "480p": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "720p": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", 
    "1080p": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  };
  
  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        let data;
        if (type === "movie") {
          data = await fetchMovieById(id);
          // Fetch similar movies by genre (in a real app, you'd have a recommendation API)
          const firstGenre = data.genres[0];
          if (firstGenre) {
            const relatedMovies = (await fetchMovieById("1")) ? [await fetchMovieById("1"), await fetchMovieById("2")] : [];
            setRelated(relatedMovies.filter(movie => movie.id !== id));
          }
        } else {
          data = await fetchTVShowById(id);
          // Fetch similar TV shows
          const firstGenre = data.genres[0];
          if (firstGenre) {
            const relatedShows = (await fetchTVShowById("1")) ? [await fetchTVShowById("1"), await fetchTVShowById("2")] : [];
            setRelated(relatedShows.filter(show => show.id !== id));
          }
        }
        setContent(data);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, type]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // For demonstration, we'll use the first source
  const videoSource = videoSources["720p"];
  
  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Button onClick={handleBack} variant="outline">Go Back</Button>
          </div>
        ) : content ? (
          <div className="page-container">
            <div className="mb-4 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">{content.title}</h1>
            </div>
            
            {/* Video Player */}
            <div className="mb-8">
              <VideoPlayer 
                src={videoSource} 
                poster={content.backdropUrl}
                title={content.title}
              />
            </div>
            
            {/* Content Info */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {content.genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-sm mb-4 text-white/80">
                <span className="mr-3">{content.releaseYear}</span>
                <span className="mr-3 flex items-center">
                  <span className="text-primary font-bold mr-1">{content.rating}</span>/10
                </span>
                <span>{content.duration}</span>
              </div>
              
              <p className="text-white/90 mb-6">
                {content.description}
              </p>
              
              <div className="mt-6">
                <Button variant="outline" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  More Details
                </Button>
              </div>
            </div>
            
            {/* Related Content */}
            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
                <ContentSlider 
                  title="" 
                  movies={related} 
                  layout="backdrop" 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
            <p className="text-white/70 mb-6">The content you are looking for doesn't exist.</p>
            <Button onClick={handleBack} variant="outline">Go Back</Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Watch;
