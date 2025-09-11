import { type ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, children, className = "" }: FormSectionProps) {
  return (
    <section className={`bg-white rounded-lg shadow p-6 ${className}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-section`}>
      <h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-section`} className="sr-only">
        {title}
      </h2>
      {children}
    </section>
  );
}
