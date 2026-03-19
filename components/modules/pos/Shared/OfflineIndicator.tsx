"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Initial check
        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <Badge variant="destructive" className="flex items-center gap-1.5 animate-pulse">
            <WifiOff className="h-3.5 w-3.5" />
            <span>Mode hors ligne</span>
        </Badge>
    );
}
