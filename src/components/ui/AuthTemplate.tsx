import { type ReactNode } from "react";

type AuthTemplateProps = {
  subtitle: string;
  children: ReactNode;
};

export function AuthTemplate({ subtitle, children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-conectar-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo-white.png" alt="Conéctar" className="h-16 w-auto" />
          </div>

          <p className="text-conectar-100 mt-2">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
      </div>
    </div>
  );
}
