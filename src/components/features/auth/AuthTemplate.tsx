import { type ReactNode } from "react";

type SuccessState = {
  icon: ReactNode;
  title: string;
  message: string;
};

type AuthTemplateProps = {
  subtitle: string;
  children: ReactNode;
  success?: SuccessState;
};

export function AuthTemplate({ subtitle, children, success }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-conectar-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo-white.png" alt="Conéctar" className="h-16 w-auto" />
          </div>

          <p className="text-conectar-100 mt-2">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                {success.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {success.title}
                </h2>
                <p className="text-success">{success.message}</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
