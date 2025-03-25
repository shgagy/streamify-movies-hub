
import React, { createContext, useState, useContext, useEffect } from "react";
import { Movie } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface MyListContextType {
  myList: Movie[];
  addToMyList: (movie: Movie) => Promise<void>;
  removeFromMyList: (movieId: string) => Promise<void>;
  isInMyList: (movieId: string) => boolean;
  loading: boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch the user's list from localStorage when the user is logged in
  useEffect(() => {
    const fetchMyList = async () => {
      if (!user) {
        setMyList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const storageKey = `streamify-mylist-${user.id}`;
        const savedList = localStorage.getItem(storageKey);
        
        if (savedList) {
          const parsedList = JSON.parse(savedList);
          setMyList(parsedList);
        } else {
          setMyList([]);
        }
      } catch (error) {
        console.error("Error fetching my list:", error);
        toast.error("Failed to load your list");
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, [user]);

  const saveList = (updatedList: Movie[]) => {
    if (user) {
      const storageKey = `streamify-mylist-${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    }
  };

  const addToMyList = async (movie: Movie) => {
    if (!user) {
      toast.error("Please sign in to add to your list");
      return;
    }

    if (isInMyList(movie.id)) {
      toast("This movie is already in your list");
      return;
    }
    
    try {
      const updatedList = [movie, ...myList];
      setMyList(updatedList);
      saveList(updatedList);
      toast.success("Added to My List");
    } catch (error) {
      console.error("Error adding to my list:", error);
      toast.error("Failed to add to your list");
    }
  };

  const removeFromMyList = async (movieId: string) => {
    if (!user) {
      toast.error("Please sign in to modify your list");
      return;
    }

    try {
      const updatedList = myList.filter((movie) => movie.id !== movieId);
      setMyList(updatedList);
      saveList(updatedList);
      toast.success("Removed from My List");
    } catch (error) {
      console.error("Error removing from my list:", error);
      toast.error("Failed to remove from your list");
    }
  };

  const isInMyList = (movieId: string) => {
    return myList.some((movie) => movie.id === movieId);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList, loading }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};
