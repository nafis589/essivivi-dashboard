import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/services/auth-service";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadedUser = authService.getUser();
        setUser(loadedUser);
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push("/auth/v1/login");
    };

    return { user, logout };
}
