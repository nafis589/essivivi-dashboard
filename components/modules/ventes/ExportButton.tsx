"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    onExport: () => void;
    isLoading?: boolean;
}

export function ExportButton({ onExport, isLoading }: ExportButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 shadow-sm border-slate-200 hover:bg-slate-50 font-medium"
            onClick={onExport}
            disabled={isLoading}
        >
            <Download className="h-4 w-4" />
            Exporter CSV
        </Button>
    );
}
