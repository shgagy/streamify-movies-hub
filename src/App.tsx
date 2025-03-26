
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyListProvider } from "@/contexts/MyListContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import MyList from "./pages/MyList";
import SearchResults from "./pages/SearchResults";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Watch from "./pages/Watch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MyListProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/watch/:type/:id" element={<Watch />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MyListProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
