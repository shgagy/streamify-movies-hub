
import React, { useState } from "react";
import { genres } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenreFilterProps {
  onSelectGenre: (genreId: string | null) => void;
  selectedGenreId: string | null;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  onSelectGenre, 
  selectedGenreId 
}) => {
  return (
    <div className="overflow-x-auto scrollbar-none py-2">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectGenre(null)}
          className={cn(
            "whitespace-nowrap",
            selectedGenreId === null
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-streamify-darkgray hover:bg-streamify-gray"
          )}
        >
          All Genres
        </Button>
        
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant="outline"
            size="sm"
            onClick={() => onSelectGenre(genre.id)}
            className={cn(
              "whitespace-nowrap",
              selectedGenreId === genre.id
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-streamify-darkgray hover:bg-streamify-gray"
            )}
          >
            {genre.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
