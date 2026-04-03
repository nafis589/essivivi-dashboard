import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { formatCurrency } from "@/lib/modules/ventes/utils";

const data = [
    { name: "Lun", total: 1200 },
    { name: "Mar", total: 2100 },
    { name: "Mer", total: 1800 },
    { name: "Jeu", total: 2400 },
    { name: "Ven", total: 3200 },
    { name: "Sam", total: 4100 },
    { name: "Dim", total: 3800 },
];

export function SalesChart() {
    const [activeRange, setActiveRange] = useState("7d");

    return (
        <Card className="col-span-full xl:col-span-4 border border-slate-200/60 bg-white/60 shadow-sm backdrop-blur-xl relative overflow-hidden group">
            {/* Soft gradient border effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

            <CardHeader className="flex flex-row items-center flex-wrap justify-between gap-4 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-slate-900 tracking-tight">Tendances des Revenus</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500">
                        Évolution du chiffre d'affaires sur la période
                    </CardDescription>
                </div>

                <div className="flex bg-slate-100/80 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveRange("7d")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeRange === '7d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                    >
                        7 Jours
                    </button>
                    <button
                        onClick={() => setActiveRange("30d")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeRange === '30d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                    >
                        30 Jours
                    </button>
                    <button
                        onClick={() => setActiveRange("12m")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeRange === '12m' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                    >
                        12 Mois
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} FCFA`}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(226, 232, 240, 0.8)',
                                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
                                }}
                                itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                                formatter={(value: any) => [formatCurrency(value as number), 'Revenu']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
