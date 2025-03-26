
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-streamify-black text-white flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-white/80 mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-white/60 mb-8">
            You might have tried to access the wrong URL or the content may have been moved.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
