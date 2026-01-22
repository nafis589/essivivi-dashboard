"use client";

import * as React from "react";
import { TrendingUp, AlertCircle, FileWarning } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { statsService } from "@/services/stats.service";
import type { ProductionStats, FinancialStats } from "@/services/stats.service";

const revenueConfig = {
    revenue: {
        label: "Chiffre d'Affaires",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const peakHoursConfig = {
    sales: {
        label: "Ventes",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const topZonesConfig = {
    value: {
        label: "Activité",
        color: "hsl(var(--chart-3))"
    }
} satisfies ChartConfig;

export function StatisticalAnalysis() {
    const [productionStats, setProductionStats] = React.useState<ProductionStats | null>(null);
    const [financialStats, setFinancialStats] = React.useState<FinancialStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const results = await Promise.allSettled([
                statsService.getProductionStats(30),
                statsService.getFinancialReports("daily")
            ]);

            let hasError = false;

            if (results[0].status === "fulfilled") {
                console.log("StatisticalAnalysis - Production Stats:", results[0].value);
                setProductionStats(results[0].value);
            } else {
                console.error("Failed to fetch production stats", results[0].reason);
                hasError = true;
            }

            if (results[1].status === "fulfilled") {
                console.log("StatisticalAnalysis - Financial Stats:", results[1].value);
                setFinancialStats(results[1].value);
            } else {
                console.error("Failed to fetch financial reports", results[1].reason);
                hasError = true;
            }

            if (hasError) {
                setError("Certaines données n'ont pas pu être récupérées du serveur.");
            }
        } catch (error) {
            console.error("Unexpected error in statistical analysis fetch", error);
            setError("Une erreur inattendue s'est produite lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-8 text-center">Chargement des analyses...</div>;
    }

    // Handle flexible data structure (snake_case vs camelCase)
    const historyData = (financialStats as any)?.revenue_history ?? (financialStats as any)?.revenueHistory ?? [];
    const revenueData = historyData.map((item: any) => ({
        month: item.period || item.month || "Inconnu",
        revenue: item.revenue || item.amount || 0
    }));

    const peakHoursData = (productionStats as any)?.peak_hours ?? (productionStats as any)?.peakHours ?? [];
    const topZonesData = (productionStats as any)?.top_zones ?? (productionStats as any)?.topZones ?? [];

    const hasRevenueData = revenueData.length > 0;
    const hasPeakHoursData = peakHoursData.length > 0;
    const hasTopZonesData = topZonesData.length > 0;

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!hasRevenueData && !hasPeakHoursData && !hasTopZonesData && !error && (
                <Alert>
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Aucune donnée</AlertTitle>
                    <AlertDescription>
                        Le serveur backend n'a retourné aucune donnée statistique pour le moment.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                        <CardDescription>Période Actuelle</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasRevenueData ? (
                            <ChartContainer config={revenueConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={revenueData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month" // Actually period/date
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)} // Show simplified label
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Area
                                        dataKey="revenue"
                                        type="natural"
                                        fill="var(--color-revenue)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-revenue)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                Aucune donnée disponible
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        {hasRevenueData && (
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 font-medium leading-none">
                                        Données en temps réel <TrendingUp className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Heures de Pointe</CardTitle>
                        <CardDescription>Volume de ventes par heure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasPeakHoursData ? (
                            <ChartContainer config={peakHoursConfig}>
                                <BarChart accessibilityLayer data={peakHoursData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="hour"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                Aucune donnée disponible
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Zones Géographiques Populaires</CardTitle>
                        <CardDescription>Top quartiers plus actifs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasTopZonesData ? (
                            <ChartContainer config={topZonesConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={topZonesData}
                                    layout="vertical"
                                    margin={{
                                        left: 20,
                                    }}
                                >
                                    <YAxis
                                        dataKey="zone"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <XAxis dataKey="value" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="value" fill="var(--color-value)" radius={5} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                Aucune donnée disponible
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
