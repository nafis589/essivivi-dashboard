"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Users } from "lucide-react";
import { statsService } from "@/services/stats.service";
import type { DashboardStats, AgentPerformance } from "@/services/stats.service";

export function ProductionReports() {
    const [stats, setStats] = React.useState<DashboardStats | null>(null);
    const [agents, setAgents] = React.useState<AgentPerformance[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                statsService.getDashboardStats(),
                statsService.getAgentPerformance()
            ]);

            if (results[0].status === "fulfilled") {
                setStats(results[0].value);
            } else {
                console.error("Failed to fetch dashboard stats", results[0].reason);
            }

            if (results[1].status === "fulfilled") {
                setAgents(results[1].value);
            } else {
                console.error("Failed to fetch agent performance", results[1].reason);
            }
        } catch (error) {
            console.error("Unexpected error in production reports fetch", error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-8 text-center">Chargement des rapports...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nombre de Livraisons</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_deliveries ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.delivery_growth ? (
                                <span className={stats.delivery_growth > 0 ? "text-green-600" : "text-red-600"}>
                                    {stats.delivery_growth > 0 ? "+" : ""}{stats.delivery_growth}%
                                </span>
                            ) : "0%"} par rapport au mois dernier
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quantité Totale</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_quantity?.toLocaleString() ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.quantity_growth ? (
                                <span className={stats.quantity_growth > 0 ? "text-green-600" : "text-red-600"}>
                                    {stats.quantity_growth > 0 ? "+" : ""}{stats.quantity_growth}%
                                </span>
                            ) : "0%"} par rapport au mois dernier
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
                        <span className="font-bold text-muted-foreground">FCFA</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_amount?.toLocaleString() ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.amount_growth ? (
                                <span className={stats.amount_growth > 0 ? "text-green-600" : "text-red-600"}>
                                    {stats.amount_growth > 0 ? "+" : ""}{stats.amount_growth}%
                                </span>
                            ) : "0%"} par rapport au mois dernier
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance par Agent</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead>Livraisons</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Montant (FCFA)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agents.length > 0 ? (
                                agents.map((agent) => (
                                    <TableRow key={agent.agent_id}>
                                        <TableCell className="font-medium">{agent.agent_name}</TableCell>
                                        <TableCell>{agent.deliveries_count}</TableCell>
                                        <TableCell>{agent.quantity_delivered?.toLocaleString()}</TableCell>
                                        <TableCell>{agent.total_amount?.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    agent.status === "Top Performer" ? "bg-green-500" :
                                                        agent.status === "Excellent" ? "bg-blue-500" :
                                                            "bg-secondary text-secondary-foreground"
                                                }
                                                variant="outline"
                                            >
                                                {agent.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        Aucun agent trouvé
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
