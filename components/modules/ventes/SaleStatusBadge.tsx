import { Badge } from "@/components/ui/badge";
import { SaleStatus } from "@/lib/modules/ventes/types";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";

interface SaleStatusBadgeProps {
    status: SaleStatus;
}

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
    switch (status) {
        case 'COMPLETED':
            return (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 flex items-center pr-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                    Complété
                </Badge>
            );
        case 'CANCELLED':
            return (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5 flex items-center pr-2.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Annulé/Remboursé
                </Badge>
            );
        case 'PENDING':
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 flex items-center pr-2.5">
                    <Clock className="w-3.5 h-3.5 fill-blue-100" />
                    En attente
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 gap-1 flex items-center">
                    <AlertCircle className="w-3 h-3" />
                    Inconnu
                </Badge>
            );
    }
}
