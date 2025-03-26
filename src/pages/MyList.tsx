
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkX, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { fetchUserList } from "@/services/api";
import { Movie } from "@/lib/mockData";

const MyList: React.FC = () => {
  const [myList, setMyList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch the user's list from MongoDB when the user is logged in
  useEffect(() => {
    const fetchList = async () => {
      if (!user) {
        setMyList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const list = await fetchUserList(user.id);
        setMyList(list as Movie[]);
      } catch (error) {
        console.error("Error fetching my list:", error);
        setMyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [user]);

  // Redirect to auth page if not logged in
  if (!userLoading && !user) {
    return (
      <div className="min-h-screen bg-streamify-black text-white">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="page-container">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookmarkX className="w-16 h-16 text-white/30 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sign in to access your list</h2>
              <p className="text-white/60 mb-6 max-w-md">
                Create an account or sign in to save movies and shows to your list
              </p>
              <Button onClick={() => navigate("/auth")} className="button-primary">
                Sign In
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : myList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {myList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="sm" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookmarkX className="w-16 h-16 text-white/30 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
              <p className="text-white/60 mb-6 max-w-md">
                Add movies and shows to your list to keep track of what you want to watch
              </p>
              <Button onClick={() => navigate("/")} className="button-primary">
                Browse Content
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyList;
