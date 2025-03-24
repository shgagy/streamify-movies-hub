
import React from "react";
import { Link } from "react-router-dom";
import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-streamify-black border-t border-streamify-gray pt-12 pb-6">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center text-white mb-4">
              <Film className="w-8 h-8 mr-2 text-primary" />
              <span className="text-xl font-bold">Streamify</span>
            </Link>
            <p className="text-white/60 mb-4">
              The ultimate streaming platform for movie and TV enthusiasts. Watch your favorite content
              anytime, anywhere.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/movies"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/tv-shows"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link
                  to="/new-releases"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  to="/coming-soon"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link
                  to="/genres"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  to="/subscription"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/help-center"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-streamify-gray pt-6 text-center text-white/40 text-sm">
          <p>© {currentYear} Streamify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
