"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth-service";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const user = authService.getUser();

        if (!user) {
            // Not logged in, redirect to login
            // Prevent redirect loop if already on login page (though AuthGuard should only wrap protected routes)
            if (!pathname.startsWith("/auth")) {
                router.push("/auth/v1/login");
            }
        } else {
            setAuthorized(true);
        }
    }, [router, pathname]);

    if (!authorized) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
