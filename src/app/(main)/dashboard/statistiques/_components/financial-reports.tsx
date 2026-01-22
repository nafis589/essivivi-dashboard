"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export function FinancialReports() {
    return (
        <div className="flex flex-col gap-4">
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
                                <TableRow>
                                    <TableCell className="font-medium">Maquis 228</TableCell>
                                    <TableCell className="text-red-500">150,000 FCFA</TableCell>
                                    <TableCell>2024-06-01</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Hotel Sarakawa</TableCell>
                                    <TableCell className="text-red-500">500,000 FCFA</TableCell>
                                    <TableCell>2024-06-15</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Boutique Abla</TableCell>
                                    <TableCell className="text-red-500">25,000 FCFA</TableCell>
                                    <TableCell>2024-05-30</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Prévisions de Ventes</CardTitle>
                        <CardDescription>Objectifs vs Réalisé (Juin 2024)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Chiffre d'affaires Global</span>
                                <span className="text-muted-foreground">85% (8.5M / 10M FCFA)</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Ventes Tricycles</span>
                                <span className="text-muted-foreground">60% (3M / 5M FCFA)</span>
                            </div>
                            <Progress value={60} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Ventes Gros</span>
                                <span className="text-muted-foreground">92% (4.6M / 5M FCFA)</span>
                            </div>
                            <Progress value={92} className="h-2" />
                        </div>
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
                            <TableRow>
                                <TableCell className="font-medium">Mai 2024</TableCell>
                                <TableCell>12,500,000 FCFA</TableCell>
                                <TableCell>11,000,000 FCFA</TableCell>
                                <TableCell className="text-green-600">+13.6%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Avril 2024</TableCell>
                                <TableCell>10,200,000 FCFA</TableCell>
                                <TableCell>10,000,000 FCFA</TableCell>
                                <TableCell className="text-green-600">+2.0%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Mars 2024</TableCell>
                                <TableCell>9,800,000 FCFA</TableCell>
                                <TableCell>10,000,000 FCFA</TableCell>
                                <TableCell className="text-red-600">-2.0%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
