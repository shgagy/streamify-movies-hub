
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-streamify-black text-white">
      <div className="text-center max-w-md p-6 bg-background/10 rounded-lg backdrop-blur-sm border border-white/10">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/80 mb-6">Content Not Found</p>
        <p className="text-base text-white/60 mb-8">
          The content you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="default" className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
