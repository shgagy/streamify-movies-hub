
import React, { createContext, useState, useContext, useEffect } from "react";
import { Movie } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch the user's list from Supabase when the user is logged in
  useEffect(() => {
    const fetchMyList = async () => {
      if (!user) {
        setMyList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('my_list')
          .select('*')
          .eq('user_id', user.id)
          .order('added_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert Supabase data to Movie objects by pulling from mockData
        // In a real app, we would store more movie data or fetch it from an API
        if (data) {
          // For now, we'll assume our mockData has all the movies we need
          const moviesFromDb = data.map((item) => {
            const movieData = JSON.parse(item.content_id);
            return movieData;
          });
          
          setMyList(moviesFromDb);
        }
      } catch (error) {
        console.error("Error fetching my list:", error);
        toast.error("Failed to load your list");
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
    
    // Set up realtime subscription for updates to my_list
    const myListSubscription = supabase
      .channel('my_list_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'my_list',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, 
        () => {
          // Refresh the list when changes are detected
          fetchMyList();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(myListSubscription);
    };
  }, [user]);

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
      // Insert into Supabase
      const { error } = await supabase
        .from('my_list')
        .insert({
          user_id: user.id,
          content_id: JSON.stringify(movie),
          content_type: 'movie' // Assuming it's a movie for now
        });

      if (error) {
        throw error;
      }

      // Optimistically update the UI
      setMyList((prevList) => [movie, ...prevList]);
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
      // Delete from Supabase
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('user_id', user.id)
        .like('content_id', `%"id":"${movieId}"%`);

      if (error) {
        throw error;
      }

      // Optimistically update the UI
      setMyList((prevList) => prevList.filter((movie) => movie.id !== movieId));
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
