"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
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

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                statsService.getProductionStats(30),
                statsService.getFinancialReports("daily")
            ]);

            if (results[0].status === "fulfilled") {
                setProductionStats(results[0].value);
            } else {
                console.error("Failed to fetch production stats", results[0].reason);
            }

            if (results[1].status === "fulfilled") {
                setFinancialStats(results[1].value);
            } else {
                console.error("Failed to fetch financial reports", results[1].reason);
            }
        } catch (error) {
            console.error("Unexpected error in statistical analysis fetch", error);
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

    const revenueData = financialStats?.revenue_history?.map(item => ({
        month: item.period, // API might return "2024-05", we might want to format. Assuming string.
        revenue: item.revenue
    })) || [];

    const peakHoursData = productionStats?.peak_hours || [];
    const topZonesData = productionStats?.top_zones || [];

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                        <CardDescription>Période Actuelle</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Données en temps réel <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Heures de Pointe</CardTitle>
                        <CardDescription>Volume de ventes par heure</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
