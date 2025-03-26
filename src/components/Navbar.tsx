
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, Film, Home, Compass, Bell, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { genres } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import ProfileButton from "./ProfileButton";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Create a conditional approach to handle myList count
  const { user } = useAuth();
  const [myListCount, setMyListCount] = useState(0);
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to get myList count from localStorage if user is logged in
  useEffect(() => {
    if (user) {
      try {
        const storageKey = `streamify-mylist-${user.id}`;
        const savedList = localStorage.getItem(storageKey);
        
        if (savedList) {
          const parsedList = JSON.parse(savedList);
          setMyListCount(parsedList.length);
        } else {
          setMyListCount(0);
        }
      } catch (error) {
        console.error("Error fetching my list count:", error);
        setMyListCount(0);
      }
    } else {
      setMyListCount(0);
    }
  }, [user]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300",
        isScrolled
          ? "bg-streamify-black/90 backdrop-blur shadow-md"
          : "bg-gradient-to-b from-streamify-black to-transparent"
      )}
    >
      <div className="page-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white">
          <Film className="w-8 h-8 mr-2 text-primary" />
          <span className="text-xl font-bold">Streamify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          <Link to="/tv-shows" className="nav-link">
            TV Shows
          </Link>
          <Link to="/my-list" className="nav-link">
            My List {myListCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-primary rounded-full text-xs">{myListCount}</span>}
          </Link>
          <div className="group relative">
            <button className="nav-link">Genres</button>
            <div className="absolute top-full left-0 hidden group-hover:grid grid-cols-3 gap-2 p-4 bg-streamify-darkgray rounded-md shadow-lg w-[500px] animate-fade-in">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="px-3 py-2 hover:bg-streamify-gray rounded-md transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right side - Search, Notifications, User */}
        <div className="flex items-center">
          {/* Search */}
          <button
            onClick={toggleSearch}
            className="p-2 text-white/80 hover:text-white transition-colors relative"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User navigation - desktop */}
          <div className="hidden md:flex items-center ml-4">
            <Link
              to="/notifications"
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <Link
              to="/my-list"
              className="p-2 text-white/80 hover:text-white transition-colors relative"
              aria-label="My List"
            >
              <Bookmark className="w-5 h-5" />
              {myListCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center">
                  {myListCount}
                </span>
              )}
            </Link>
            
            {/* Profile Button */}
            <ProfileButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 ml-2 text-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-streamify-black/95 backdrop-blur-md md:hidden animate-fade-in">
            <nav className="flex flex-col p-5 space-y-4">
              <Link
                to="/"
                className="flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/movies"
                className="flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="w-5 h-5" />
                <span>Movies</span>
              </Link>
              <Link
                to="/tv-shows"
                className="flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="w-5 h-5" />
                <span>TV Shows</span>
              </Link>
              <Link
                to="/my-list"
                className="flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bookmark className="w-5 h-5" />
                <span>My List</span>
                {myListCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 bg-primary rounded-full text-xs">
                    {myListCount}
                  </span>
                )}
              </Link>
              <Link
                to="/explore"
                className="flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Compass className="w-5 h-5" />
                <span>Explore</span>
              </Link>
              
              <div className="border-t border-streamify-gray my-2 pt-2">
                <h3 className="px-3 text-sm text-white/50 uppercase font-medium mb-2">Genres</h3>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genre/${genre.id}`}
                      className="px-3 py-2 hover:bg-streamify-gray rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-streamify-gray my-2 pt-4 flex justify-center">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full button-primary">
                    Sign In
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Search overlay */}
        {searchOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-streamify-black/95 backdrop-blur-md animate-fade-in">
            <div className="p-4 max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Search</h2>
                <button
                  onClick={toggleSearch}
                  className="text-white/80 hover:text-white"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SearchBar onClose={toggleSearch} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
