// Mock data for development purposes
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  rating: number; // 1-10
  duration: string;
  genres: string[];
  cast: string[];
  director: string;
  trailerUrl?: string;
  featured?: boolean;
}

export interface TVShow extends Movie {
  seasons: number;
  episodes: number;
  creator: string;
}

export interface Genre {
  id: string;
  name: string;
}

export const genres: Genre[] = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "comedy", name: "Comedy" },
  { id: "drama", name: "Drama" },
  { id: "fantasy", name: "Fantasy" },
  { id: "horror", name: "Horror" },
  { id: "sci-fi", name: "Sci-Fi" },
  { id: "thriller", name: "Thriller" },
  { id: "romance", name: "Romance" },
];

export const movies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    releaseYear: 2010,
    rating: 8.8,
    duration: "2h 28min",
    genres: ["Action", "Adventure", "Sci-Fi"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    director: "Christopher Nolan",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    featured: true,
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    releaseYear: 1994,
    rating: 9.3,
    duration: "2h 22min",
    genres: ["Drama"],
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    director: "Frank Darabont",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
  },
  {
    id: "3",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    releaseYear: 2008,
    rating: 9.0,
    duration: "2h 32min",
    genres: ["Action", "Crime", "Drama"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    director: "Christopher Nolan",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    featured: true,
  },
  {
    id: "4",
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseYear: 1994,
    rating: 8.9,
    duration: "2h 34min",
    genres: ["Crime", "Drama"],
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
    director: "Quentin Tarantino",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
  },
  {
    id: "5",
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    releaseYear: 2014,
    rating: 8.6,
    duration: "2h 49min",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    director: "Christopher Nolan",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVHc-cE",
    featured: true,
  },
  {
    id: "6",
    title: "Fight Club",
    description:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    posterUrl: "https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
    releaseYear: 1999,
    rating: 8.8,
    duration: "2h 19min",
    genres: ["Drama"],
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    director: "David Fincher",
    trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
  },
  {
    id: "7",
    title: "Parasite",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    posterUrl: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    releaseYear: 2019,
    rating: 8.5,
    duration: "2h 12min",
    genres: ["Comedy", "Drama", "Thriller"],
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
    director: "Bong Joon-ho",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
  },
  {
    id: "8",
    title: "The Matrix",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    releaseYear: 1999,
    rating: 8.7,
    duration: "2h 16min",
    genres: ["Action", "Sci-Fi"],
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
    director: "Lana and Lilly Wachowski",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
  },
  {
    id: "9",
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    posterUrl: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    releaseYear: 1972,
    rating: 9.2,
    duration: "2h 55min",
    genres: ["Crime", "Drama"],
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Richard S. Castellano"],
    director: "Francis Ford Coppola",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
  },
  {
    id: "10",
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    posterUrl: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/uBmnmLomGYKt7ZyZUkbL1SSDHd5.jpg",
    releaseYear: 2001,
    rating: 8.6,
    duration: "2h 5min",
    genres: ["Animation", "Adventure", "Family"],
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki", "Takashi Naitō"],
    director: "Hayao Miyazaki",
    trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
  },
];

export const tvShows: TVShow[] = [
  {
    id: "tv1",
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    posterUrl: "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    releaseYear: 2008,
    rating: 9.5,
    duration: "45min",
    genres: ["Drama", "Crime", "Thriller"],
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris"],
    director: "",
    creator: "Vince Gilligan",
    seasons: 5,
    episodes: 62,
    featured: true,
  },
  {
    id: "tv2",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    posterUrl: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    releaseYear: 2016,
    rating: 8.7,
    duration: "50min",
    genres: ["Drama", "Fantasy", "Horror"],
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
    director: "",
    creator: "The Duffer Brothers",
    seasons: 4,
    episodes: 34,
    featured: true,
  },
  {
    id: "tv3",
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    posterUrl: "https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    releaseYear: 2011,
    rating: 9.3,
    duration: "60min",
    genres: ["Action", "Adventure", "Drama"],
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage", "Lena Headey"],
    director: "",
    creator: "David Benioff, D.B. Weiss",
    seasons: 8,
    episodes: 73,
    featured: true,
  },
  {
    id: "tv4",
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    posterUrl: "https://image.tmdb.org/t/p/original/uXkGRb1MrJMXJjSjGUuYZKvEVAX.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/4JKjuXlXj2tNV3vK5EDMtcKXDo0.jpg",
    releaseYear: 2016,
    rating: 8.7,
    duration: "58min",
    genres: ["Drama", "History"],
    cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton", "Matt Smith"],
    director: "",
    creator: "Peter Morgan",
    seasons: 5,
    episodes: 50,
    featured: false,
  },
  {
    id: "tv5",
    title: "The Mandalorian",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    posterUrl: "https://image.tmdb.org/t/p/original/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    releaseYear: 2019,
    rating: 8.8,
    duration: "40min",
    genres: ["Action", "Adventure", "Sci-Fi"],
    cast: ["Pedro Pascal", "Carl Weathers", "Giancarlo Esposito", "Gina Carano"],
    director: "",
    creator: "Jon Favreau",
    seasons: 3,
    episodes: 24,
    featured: false,
  },
  {
    id: "tv6",
    title: "Succession",
    description: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company.",
    posterUrl: "https://image.tmdb.org/t/p/original/5clSyRjon7U7PMveLdRzmBVnJui.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/xkhoEuSgWfkueSaTa8iKBMQ9zU.jpg",
    releaseYear: 2018,
    rating: 8.8,
    duration: "60min",
    genres: ["Drama"],
    cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook", "Kieran Culkin"],
    director: "",
    creator: "Jesse Armstrong",
    seasons: 4,
    episodes: 40,
    featured: false,
  },
  {
    id: "tv7",
    title: "The Queen's Gambit",
    description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
    posterUrl: "https://image.tmdb.org/t/p/original/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg",
    releaseYear: 2020,
    rating: 8.6,
    duration: "60min",
    genres: ["Drama"],
    cast: ["Anya Taylor-Joy", "Thomas Brodie-Sangster", "Harry Melling", "Moses Ingram"],
    director: "",
    creator: "Scott Frank, Allan Scott",
    seasons: 1,
    episodes: 7,
    featured: false,
  },
  {
    id: "tv8",
    title: "The Last of Us",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    posterUrl: "https://image.tmdb.org/t/p/original/uKvVjHNqB6vPQxm5QQ8tyCvnNiO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnNRP.jpg",
    releaseYear: 2023,
    rating: 8.7,
    duration: "60min",
    genres: ["Action", "Adventure", "Drama"],
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna", "Anna Torv"],
    director: "",
    creator: "Craig Mazin, Neil Druckmann",
    seasons: 1,
    episodes: 9,
    featured: true,
  },
];

// Helper function to get featured movies
export const getFeaturedMovies = () => {
  return movies.filter((movie) => movie.featured);
};

// Helper function to get featured TV shows
export const getFeaturedTVShows = () => {
  return tvShows.filter((show) => show.featured);
};

// Helper function to get movies by genre
export const getMoviesByGenre = (genreId: string) => {
  const genreName = genres.find((g) => g.id === genreId)?.name;
  if (!genreName) return [];
  return movies.filter((movie) => movie.genres.includes(genreName));
};

// Helper function to get TV shows by genre
export const getTVShowsByGenre = (genreId: string) => {
  const genreName = genres.find((g) => g.id === genreId)?.name;
  if (!genreName) return [];
  return tvShows.filter((show) => show.genres.includes(genreName));
};

// Helper function to search movies
export const searchMovies = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(lowerCaseQuery) ||
      movie.description.toLowerCase().includes(lowerCaseQuery) ||
      movie.genres.some((genre) => genre.toLowerCase().includes(lowerCaseQuery)) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(lowerCaseQuery)) ||
      movie.director.toLowerCase().includes(lowerCaseQuery)
  );
};

// Helper function to search TV shows
export const searchTVShows = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return tvShows.filter(
    (show) =>
      show.title.toLowerCase().includes(lowerCaseQuery) ||
      show.description.toLowerCase().includes(lowerCaseQuery) ||
      show.genres.some((genre) => genre.toLowerCase().includes(lowerCaseQuery)) ||
      show.cast.some((actor) => actor.toLowerCase().includes(lowerCaseQuery)) ||
      show.creator.toLowerCase().includes(lowerCaseQuery)
  );
};

// Helper function to get movie by id
export const getMovieById = (id: string) => {
  return movies.find((movie) => movie.id === id);
};

// Helper function to get TV show by id
export const getTVShowById = (id: string) => {
  return tvShows.find((show) => show.id === id);
};
