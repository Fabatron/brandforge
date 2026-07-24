import { cn } from "~/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}

export function Card({ children, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag className={cn("glass rounded-3xl p-8 sm:p-10", className)}>
      {children}
    </Tag>
  );
}
