
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Film, Home, Compass, Bell, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { genres } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import ProfileButton from "./ProfileButton";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
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

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300",
        mobileMenuOpen 
          ? "bg-streamify-black" 
          : isScrolled
            ? "bg-streamify-black shadow-md" 
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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  "nav-link flex items-center",
                  isActive("/") && "text-primary"
                )}>
                  <span>Home</span>
                  {isActive("/") && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/movies" className={cn(
                  "nav-link flex items-center",
                  isActive("/movies") && "text-primary"
                )}>
                  <span>Movies</span>
                  {isActive("/movies") && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/tv-shows" className={cn(
                  "nav-link flex items-center",
                  isActive("/tv-shows") && "text-primary"
                )}>
                  <span>TV Shows</span>
                  {isActive("/tv-shows") && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/my-list" className={cn(
                  "nav-link flex items-center",
                  isActive("/my-list") && "text-primary"
                )}>
                  <span>My List</span>
                  {myListCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-primary rounded-full text-xs">{myListCount}</span>
                  )}
                  {isActive("/my-list") && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "bg-transparent hover:bg-transparent focus:bg-transparent",
                  isActive("/genre") && "text-primary"
                )}>
                  Genres {isActive("/genre") && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-3 gap-2 p-4 w-[500px] bg-streamify-darkgray">
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
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
              className={cn(
                "p-2 text-white/80 hover:text-white transition-colors relative",
                isActive("/notifications") && "text-primary"
              )}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {isActive("/notifications") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
              )}
            </Link>
            <Link
              to="/my-list"
              className={cn(
                "p-2 text-white/80 hover:text-white transition-colors relative",
                isActive("/my-list") && "text-primary"
              )}
              aria-label="My List"
            >
              <Bookmark className="w-5 h-5" />
              {myListCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center">
                  {myListCount}
                </span>
              )}
              {isActive("/my-list") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
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
          <div className="fixed inset-0 top-16 z-40 bg-streamify-black md:hidden animate-fade-in">
            <nav className="flex flex-col p-5 space-y-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md",
                  isActive("/") && "bg-streamify-gray"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
                {isActive("/") && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Link>
              <Link
                to="/movies"
                className={cn(
                  "flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md",
                  isActive("/movies") && "bg-streamify-gray"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="w-5 h-5" />
                <span>Movies</span>
                {isActive("/movies") && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Link>
              <Link
                to="/tv-shows"
                className={cn(
                  "flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md",
                  isActive("/tv-shows") && "bg-streamify-gray"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="w-5 h-5" />
                <span>TV Shows</span>
                {isActive("/tv-shows") && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Link>
              <Link
                to="/my-list"
                className={cn(
                  "flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md",
                  isActive("/my-list") && "bg-streamify-gray"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bookmark className="w-5 h-5" />
                <span>My List</span>
                {myListCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-primary rounded-full text-xs">
                    {myListCount}
                  </span>
                )}
                {isActive("/my-list") && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Link>
              <Link
                to="/explore"
                className={cn(
                  "flex items-center space-x-2 p-3 hover:bg-streamify-gray rounded-md",
                  isActive("/explore") && "bg-streamify-gray"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Compass className="w-5 h-5" />
                <span>Explore</span>
                {isActive("/explore") && (
                  <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Link>
              
              <div className="border-t border-streamify-gray my-2 pt-2">
                <h3 className="px-3 text-sm text-white/50 uppercase font-medium mb-2">Genres</h3>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genre/${genre.id}`}
                      className={cn(
                        "px-3 py-2 hover:bg-streamify-gray rounded-md transition-colors flex items-center justify-between",
                        location.pathname === `/genre/${genre.id}` && "bg-streamify-gray"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{genre.name}</span>
                      {location.pathname === `/genre/${genre.id}` && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
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
