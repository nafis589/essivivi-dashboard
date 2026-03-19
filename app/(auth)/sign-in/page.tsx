import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";
import Link from "next/link";
import { Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | FlowCommerce",
  description: "Connectez-vous à votre espace FlowCommerce.",
};

export default function SignInPage() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-3 text-center">
          <h1 className="font-semibold text-3xl tracking-tight">Connexion à votre compte</h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">Veuillez entrer vos informations pour accéder à votre dashboard.</p>
        </div>
        
        <div className="space-y-4">
          <GoogleButton className="w-full" />
          
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continuer avec</span>
          </div>
          
          <LoginForm />
        </div>
      </div>

      {/* Shared Absolute Elements - Navigation */}
      <div className="absolute top-5 right-5 lg:right-10 animate-in fade-in slide-in-from-right-4 duration-1000">
        <div className="text-muted-foreground text-sm">
          Vous n'avez pas de compte ?{" "}
          <Link href="/sign-up" prefetch={false} className="text-foreground font-semibold hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>

      {/* Shared Absolute Elements - Footer */}
      <div className="absolute bottom-5 left-5 right-5 lg:left-10 lg:right-10 flex justify-between items-center text-muted-foreground text-[10px] uppercase tracking-wider font-medium opacity-60 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <div>© 2026 FlowCommerce</div>
        <div className="flex items-center gap-2 hover:opacity-100 cursor-pointer transition-opacity">
          <Globe className="size-3" />
          <span>FR</span>
        </div>
      </div>
    </>
  );
}

