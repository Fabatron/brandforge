import { cn } from "~/lib/cn";

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Modal({ children, onClose, className }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative glass rounded-2xl p-8 max-w-sm w-full text-center", className)}>
        {children}
      </div>
    </div>
  );
}
