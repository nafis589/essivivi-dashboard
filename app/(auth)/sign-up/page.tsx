import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | FlowCommerce",
  description: "Créez votre compte FlowCommerce en quelques clics.",
};

export default function SignUpPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <RegisterForm />
    </div>
  );
}
