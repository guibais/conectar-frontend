import { GoogleLogin } from "@react-oauth/google";

type GoogleLoginButtonProps = {
  onSuccess: (credentialResponse: any) => void;
  onError: (error?: any) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  size?: "large" | "medium" | "small";
};

export function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  text = "signin_with",
  size = "large" 
}: GoogleLoginButtonProps) {
  return (
    <div className="flex items-center justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text}
        shape="rectangular"
        theme="outline"
        size={size}
        logo_alignment="center"
      />
    </div>
  );
}
