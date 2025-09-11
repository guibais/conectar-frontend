import { type ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function SlideTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div className={`animate-in slide-in-from-right-6 fade-in duration-400 ${className}`}>
      {children}
    </div>
  );
}

export function FadeTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div className={`animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
