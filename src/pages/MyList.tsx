
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { useMyList } from "@/contexts/MyListContext";
import { Button } from "@/components/ui/button";

const MyList: React.FC = () => {
  const { myList } = useMyList();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {myList.length > 0 ? (
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
