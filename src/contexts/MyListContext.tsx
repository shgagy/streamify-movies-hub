
import React, { createContext, useState, useContext, useEffect } from "react";
import { Movie } from "@/lib/mockData";
import { toast } from "sonner";

interface MyListContextType {
  myList: Movie[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (movieId: string) => void;
  isInMyList: (movieId: string) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>(() => {
    // Load from localStorage on initial render
    const savedList = localStorage.getItem("myList");
    return savedList ? JSON.parse(savedList) : [];
  });

  // Save to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (movie: Movie) => {
    if (isInMyList(movie.id)) {
      toast("This movie is already in your list");
      return;
    }
    
    setMyList((prevList) => [...prevList, movie]);
    toast.success("Added to My List");
  };

  const removeFromMyList = (movieId: string) => {
    setMyList((prevList) => prevList.filter((movie) => movie.id !== movieId));
    toast.success("Removed from My List");
  };

  const isInMyList = (movieId: string) => {
    return myList.some((movie) => movie.id === movieId);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
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
