"use client";

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

const revenueData = [
    { month: "Jan", revenue: 1500000 },
    { month: "Feb", revenue: 2300000 },
    { month: "Mar", revenue: 1800000 },
    { month: "Apr", revenue: 3200000 },
    { month: "May", revenue: 2900000 },
    { month: "Jun", revenue: 4500000 },
];

const revenueConfig = {
    revenue: {
        label: "Chiffre d'Affaires",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const peakHoursData = [
    { hour: "08h", sales: 40 },
    { hour: "10h", sales: 80 },
    { hour: "12h", sales: 120 },
    { hour: "14h", sales: 90 },
    { hour: "16h", sales: 110 },
    { hour: "18h", sales: 60 },
];

const peakHoursConfig = {
    sales: {
        label: "Ventes",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const topZonesData = [
    { zone: "Adidogomé", value: 450 },
    { zone: "Bè", value: 380 },
    { zone: "Agoè", value: 320 },
    { zone: "Tokoin", value: 290 },
    { zone: "Kodjoviakopé", value: 210 },
];

const topZonesConfig = {
    value: {
        label: "Activité",
        color: "hsl(var(--chart-3))"
    }
} satisfies ChartConfig;

export function StatisticalAnalysis() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                        <CardDescription>Janvier - Juin 2024</CardDescription>
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
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
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
                                    Croissance de 12.5% ce mois <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Tendance positive sur les 6 derniers mois
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
                        <CardDescription>Top 5 des quartiers les plus actifs</CardDescription>
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
