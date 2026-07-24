import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-brand-400 text-6xl font-bold mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3 text-white">Page not found</h1>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
