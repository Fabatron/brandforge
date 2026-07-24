import { cn } from "~/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, required, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-brand-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all text-sm",
          error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-red-400 text-xs">{error}</p>}
    </div>
  );
}
