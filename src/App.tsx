
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyListProvider } from "@/contexts/MyListContext";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import MyList from "./pages/MyList";
import SearchResults from "./pages/SearchResults";
import Movies from "./pages/Movies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MyListProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movies" element={<Movies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MyListProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
