import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            Brand<span className="text-brand-400">Forge</span>
          </span>
          <span className="text-gray-600 text-sm">AI</span>
        </div>

        <div className="flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">About</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
        </div>

        <p className="text-gray-600 text-sm">© 2026 BrandForge AI</p>
      </div>
    </footer>
  );
}
