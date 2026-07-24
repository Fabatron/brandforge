import { cn } from "~/lib/cn";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, active, selected, onClick, onRemove, className }: ChipProps) {
  const isActive = active ?? selected;

  if (onRemove) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 bg-brand-500/15 border border-brand-400/30 rounded-lg px-3 py-1 text-sm text-brand-300 animate-fade-in",
          className
        )}
      >
        {children}
        <button
          type="button"
          onClick={onRemove}
          className="text-brand-400 hover:text-brand-200 transition-colors"
        >
          ×
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-brand-500/20 border border-brand-400/40 text-brand-300"
          : "bg-gray-800/50 border border-gray-700/40 text-gray-400 hover:border-gray-600/60 hover:text-gray-300",
        className
      )}
    >
      {children}
      {isActive && <span className="ml-1.5 text-brand-400">✓</span>}
    </button>
  );
}
