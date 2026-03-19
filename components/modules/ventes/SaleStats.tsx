import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/modules/ventes/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, TrendingUp, CreditCard } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: number;
    description?: string;
    data?: number[];
    color?: "indigo" | "emerald" | "amber" | "rose";
}

const colorMap = {
    indigo: {
        bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
        icon: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-500/20",
        glow: "from-indigo-500/20 via-indigo-500/5 to-transparent",
        chart: "#6366f1"
    },
    emerald: {
        bg: "bg-emerald-50/50 dark:bg-emerald-500/10",
        icon: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
        glow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        chart: "#10b981"
    },
    amber: {
        bg: "bg-amber-50/50 dark:bg-amber-500/10",
        icon: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
        glow: "from-amber-500/20 via-amber-500/5 to-transparent",
        chart: "#f59e0b"
    },
    rose: {
        bg: "bg-rose-50/50 dark:bg-rose-500/10",
        icon: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20",
        glow: "from-rose-500/20 via-rose-500/5 to-transparent",
        chart: "#f43f5e"
    }
};

function StatCard({ title, value, icon, trend, description, data = [], color = "indigo" }: StatCardProps) {
    const theme = colorMap[color];
    const chartData = data.map((v, i) => ({ value: v, index: i }));

    return (
        <Card className={`relative overflow-hidden group border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300`}>
            {/* Top gradient line */}
            <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2.5">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${theme.bg} ${theme.border} border`}>
                                <div className={theme.icon}>{icon}</div>
                            </div>
                            <p className="text-[13px] font-medium text-slate-500">{title}</p>
                        </div>

                        <div className="flex items-baseline space-x-2">
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                                {value}
                            </h2>
                        </div>

                        <div className="flex items-center items-baseline space-x-2">
                            {trend !== undefined && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${trend >= 0 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'}`}>
                                    {trend >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                                    {Math.abs(trend)}%
                                </span>
                            )}
                            {description && (
                                <span className="text-xs text-slate-500 font-medium">{description}</span>
                            )}
                        </div>
                    </div>

                    {/* Mini Chart */}
                    {chartData.length > 0 && (
                        <div className="w-20 h-12 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={theme.chart}
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Elegant bottom gradient reflection */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Card>
    );
}

export function SaleStats({
    totalRevenue,
    totalSalesCount,
    todayRevenue,
    averageSaleAmount
}: {
    totalRevenue: number,
    totalSalesCount: number,
    todayRevenue: number,
    averageSaleAmount: number
}) {
    // Mock sparkline data
    const revData = [4000, 3000, 5000, 4500, 6000, 5500, 7000];
    const salesData = [12, 10, 15, 14, 20, 18, 25];
    const todayData = [100, 200, 150, 400, 300, 600, 550];
    const avgData = [35, 40, 38, 45, 42, 50, 48];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 col-span-full">
            <StatCard
                title="Revenu Total"
                value={formatCurrency(totalRevenue)}
                icon={<DollarSign className="h-4 w-4" />}
                trend={12.5}
                description="vs mois préc."
                data={revData}
                color="indigo"
            />
            <StatCard
                title="Ventes Réalisées"
                value={totalSalesCount.toString()}
                icon={<ShoppingBag className="h-4 w-4" />}
                trend={8.2}
                description="vs mois préc."
                data={salesData}
                color="emerald"
            />
            <StatCard
                title="Revenus du Jour"
                value={formatCurrency(todayRevenue)}
                icon={<TrendingUp className="h-4 w-4" />}
                trend={-2.4}
                description="vs hier"
                data={todayData}
                color="amber"
            />
            <StatCard
                title="Panier Moyen"
                value={formatCurrency(averageSaleAmount)}
                icon={<CreditCard className="h-4 w-4" />}
                trend={4.1}
                description="vs mois préc."
                data={avgData}
                color="rose"
            />
        </div>
    );
}
