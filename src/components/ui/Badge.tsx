import { cn } from "~/lib/cn";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  success: "text-emerald-400 bg-emerald-500/10",
  warning: "text-brand-400 bg-brand-500/10",
  error: "text-red-400 bg-red-500/10",
  info: "text-brand-400 bg-brand-500/10",
  neutral: "text-gray-500 bg-gray-500/10",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium px-2.5 py-1 rounded-full",
        variantStyles[variant],
        variant === "warning" && "animate-pulse",
        className
      )}
    >
      {children}
    </span>
  );
}
