import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | FlowCommerce",
  description: "Connectez-vous à votre espace FlowCommerce.",
};

export default function SignInPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <LoginForm />
    </div>
  );
}
