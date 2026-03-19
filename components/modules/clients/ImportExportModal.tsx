'use client'

import { useState } from 'react'
import { Download, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface ImportExportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ImportExportModal({ open, onOpenChange }: ImportExportModalProps) {
    const [isUploading, setIsUploading] = useState(false)

    const handleExport = () => {
        // Simulation export CSV
        toast.success('Export réussi', {
            description: 'Le fichier clients.csv a été téléchargé'
        })
        onOpenChange(false)
    }

    const handleImport = () => {
        setIsUploading(true)
        setTimeout(() => {
            setIsUploading(false)
            toast.success('Import réussi', {
                description: '20 nouveaux clients ont été ajoutés'
            })
            onOpenChange(false)
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importer / Exporter les clients</DialogTitle>
                    <DialogDescription>
                        Gérez votre base de données clients via fichier CSV.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="import" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="import">Importer</TabsTrigger>
                        <TabsTrigger value="export">Exporter</TabsTrigger>
                    </TabsList>

                    <TabsContent value="import" className="space-y-4 py-4">
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium">Cliquez ou glissez un fichier CSV ici</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Taille maximum: 5MB
                            </p>
                        </div>
                        <div className="flex bg-muted/50 rounded-md p-3 text-sm">
                            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div className="flex-1 space-y-1">
                                <p className="font-medium text-foreground text-xs leading-none">Format requis</p>
                                <p className="text-xs text-muted-foreground">colonnes : nom, téléphone, email, adresse, notes</p>
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleImport} disabled={isUploading}>
                            {isUploading ? 'Importation...' : 'Lancer l\'importation'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="export" className="space-y-4 py-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Export complet</h4>
                            <p className="text-sm text-muted-foreground">
                                Téléchargez un fichier CSV contenant toutes les informations de vos clients,
                                incluant leurs coordonnées et statistiques d'achat.
                            </p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger CSV
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
