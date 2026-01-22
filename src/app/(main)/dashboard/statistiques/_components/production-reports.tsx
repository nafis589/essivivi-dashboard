"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Users } from "lucide-react";

export function ProductionReports() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nombre de Livraisons</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quantité Totale</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,231</div>
                        <p className="text-xs text-muted-foreground">+15% par rapport au mois dernier</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
                        <span className="font-bold text-muted-foreground">FCFA</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234,000</div>
                        <p className="text-xs text-muted-foreground">+19% par rapport au mois dernier</p>
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
                            <TableRow>
                                <TableCell className="font-medium">Koffi Mensah</TableCell>
                                <TableCell>320</TableCell>
                                <TableCell>12,400</TableCell>
                                <TableCell>3,200,000</TableCell>
                                <TableCell><Badge className="bg-green-500">Top Performer</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Ama Doe</TableCell>
                                <TableCell>280</TableCell>
                                <TableCell>10,100</TableCell>
                                <TableCell>2,800,000</TableCell>
                                <TableCell><Badge variant="outline">Excellent</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Yao Paul</TableCell>
                                <TableCell>210</TableCell>
                                <TableCell>8,500</TableCell>
                                <TableCell>2,100,000</TableCell>
                                <TableCell><Badge variant="secondary">Bon</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Afi Akpene</TableCell>
                                <TableCell>150</TableCell>
                                <TableCell>5,200</TableCell>
                                <TableCell>1,500,000</TableCell>
                                <TableCell><Badge variant="secondary">Moyen</Badge></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
