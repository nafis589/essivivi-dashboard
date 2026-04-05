# 🔐 Documentation Authentification Frontend - FloCommerce

Cette documentation détaille l'intégration de l'authentification **Better Auth** dans votre application Frontend (React / Next.js).

## 🚀 Installation

Dans votre projet frontend, installez le client Better Auth:

```bash
npm install better-auth
```

## 🛠️ Configuration du Client

Créez un fichier `lib/auth-client.ts` dans votre frontend pour initialiser le client.

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // URL de votre API Backend
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", 
})

// Déstructuration des hooks essentiels
export const { 
    useSession, 
    signIn, 
    signOut, 
    signUp, 
    useActiveMember, 
    useActiveOrganization 
} = authClient;
```

---

## 📝 Fonctionnalités Principales

### 1. Inscription (Sign Up)
Pour l'inscription, nous utilisons la méthode `signUp.email`. Notez que nous avons des champs personnalisés configurés côté backend.

```typescript
const handleSignUp = async () => {
    const { data, error } = await authClient.signUp.email({
        email: "user@example.com",
        password: "password123",
        name: "Jean Dupont",
        // Champs additionnels supportés par notre backend :
        firstName: "Jean",
        lastName: "Dupont",
        companyName: "Ma Super Entreprise",
        phone: "0102030405",
        image: "https://example.com/avatar.png", // Optionnel
    });

    if (error) {
        console.error("Erreur d'inscription:", error.message);
        return;
    }
    
    console.log("Utilisateur créé et connecté:", data.user);
};
```

### 2. Connexion (Sign In)
#### Via Email
```typescript
const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email({
        email: "user@example.com",
        password: "password123",
    });

    if (error) {
        alert(error.message);
    }
};
```

#### Via GitHub (Social)
Notre backend est configuré pour supporter GitHub.
```typescript
const handleGitHubSignIn = async () => {
    await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard", // Rediriger ici après succès
    });
};
```

### 3. Informations de l'Utilisateur Connecté
Utilisez le hook `useSession` pour obtenir les données en temps réel.

```tsx
import { useSession } from "@/lib/auth-client";

export default function UserProfile() {
    const { data: session, isPending, error } = useSession();

    if (isPending) return <p>Chargement...</p>;
    
    if (!session) return <p>Non connecté</p>;

    const { user } = session;

    return (
        <div>
            <h1>Bonjour, {user.firstName} {user.lastName}!</h1>
            <p>Email: {user.email}</p>
            <p>Entreprise: {user.companyName}</p>
            <p>Téléphone: {user.phone}</p>
            {user.image && <img src={user.image} alt="Avatar" width={50} />}
        </div>
    );
}
```

### 4. Déconnexion (Sign Out)
La déconnexion invalide la session à la fois côté client et serveur.

```typescript
const handleLogout = async () => {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                window.location.href = "/login"; // Rediriger après déconnexion
            },
        },
    });
};
```

---

## 🔒 Protection des Routes

### Client-side (React/Next.js)
```tsx
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
    return function AuthenticatedComponent(props: any) {
        const { data: session, isPending } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (!isPending && !session) {
                router.push("/login");
            }
        }, [session, isPending, router]);

        if (isPending || !session) return <div>Chargement...</div>;

        return <Component {...props} />;
    };
}
```

## 📋 Résumé des Champs Utilisateur
Voici la structure de l'objet `user` retourné par la session (basée sur notre configuration backend) :

| Champ | Type | Description |
| :--- | :--- | :--- |
| `id` | string | ID unique de l'utilisateur |
| `email` | string | Adresse email |
| `name` | string | Nom complet |
| `firstName` | string | Prénom (Custom) |
| `lastName` | string | Nom de famille (Custom) |
| `companyName` | string | Nom de l'entreprise (Custom) |
| `phone` | string | Numéro de téléphone (Custom) |
| `image` | string? | URL de l'image de profil |
| `emailVerified` | boolean | Statut de vérification de l'email |

---

> [!TIP]
> Assurez-vous que votre frontend est listé dans `trustedOrigins` dans le fichier `source/lib/auth.ts` du backend (Actuellement : `http://localhost:3000`).
