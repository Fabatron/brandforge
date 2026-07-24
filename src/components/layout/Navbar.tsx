import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg shadow-black/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-xl font-bold tracking-tight text-white">
            Brand<span className="text-brand-400">Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
          >
            Get Started
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
