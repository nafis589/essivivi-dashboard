"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { statsService } from "@/services/stats.service";
import type { FinancialStats } from "@/services/stats.service";

export function FinancialReports() {
    const [financialStats, setFinancialStats] = React.useState<FinancialStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await statsService.getFinancialReports("daily");
            if (data) {
                setFinancialStats(data);
            } else {
                console.warn("Financial reports data is empty or null");
                // Don't necessarily set error here if empty data is valid, 
                // but typically we expect an object.
            }
        } catch (error) {
            console.error("Failed to fetch financial reports", error);
            setError("Impossible de charger les rapports financiers. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-8 text-center">Chargement des rapports financiers...</div>;
    }

    const { debts, revenue_vs_target, revenue_history } = financialStats || {};

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    const getProgress = (current: number, target: number) => {
        if (!target) return 0;
        return Math.min(Math.round((current / target) * 100), 100);
    };

    const globalProgress = revenue_vs_target ? getProgress(revenue_vs_target.global.current, revenue_vs_target.global.target) : 0;
    const tricyclesProgress = revenue_vs_target ? getProgress(revenue_vs_target.tricycles.current, revenue_vs_target.tricycles.target) : 0;
    const wholesaleProgress = revenue_vs_target ? getProgress(revenue_vs_target.wholesale.current, revenue_vs_target.wholesale.target) : 0;

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Créances Clients</CardTitle>
                        <CardDescription>Montants dus par les clients (Crédit)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Montant Du</TableHead>
                                    <TableHead>Échéance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debts && debts.length > 0 ? (
                                    debts.map((debt, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{debt.client_name}</TableCell>
                                            <TableCell className="text-red-500">{formatCurrency(debt.amount_due)}</TableCell>
                                            <TableCell>{debt.due_date}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">Aucune créance trouvée</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Prévisions de Ventes</CardTitle>
                        <CardDescription>Objectifs vs Réalisé</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {revenue_vs_target && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Chiffre d'affaires Global</span>
                                        <span className="text-muted-foreground">{globalProgress}% ({formatCurrency(revenue_vs_target.global.current)} / {formatCurrency(revenue_vs_target.global.target)})</span>
                                    </div>
                                    <Progress value={globalProgress} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Ventes Tricycles</span>
                                        <span className="text-muted-foreground">{tricyclesProgress}% ({formatCurrency(revenue_vs_target.tricycles.current)} / {formatCurrency(revenue_vs_target.tricycles.target)})</span>
                                    </div>
                                    <Progress value={tricyclesProgress} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Ventes Gros</span>
                                        <span className="text-muted-foreground">{wholesaleProgress}% ({formatCurrency(revenue_vs_target.wholesale.current)} / {formatCurrency(revenue_vs_target.wholesale.target)})</span>
                                    </div>
                                    <Progress value={wholesaleProgress} className="h-2" />
                                </div>
                            </>
                        )}
                        {!revenue_vs_target && <div className="text-center text-muted-foreground">Aucune donnée de prévision</div>}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chiffre d'Affaires par Période (Détail)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Période</TableHead>
                                <TableHead>CA Réalisé</TableHead>
                                <TableHead>Objectif</TableHead>
                                <TableHead>Variation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {revenue_history && revenue_history.length > 0 ? (
                                revenue_history.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.period}</TableCell>
                                        <TableCell>{formatCurrency(item.revenue)}</TableCell>
                                        <TableCell>{formatCurrency(item.target)}</TableCell>
                                        <TableCell className={item.variation >= 0 ? "text-green-600" : "text-red-600"}>
                                            {item.variation >= 0 ? "+" : ""}{item.variation}%
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Aucun historique trouvé</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
