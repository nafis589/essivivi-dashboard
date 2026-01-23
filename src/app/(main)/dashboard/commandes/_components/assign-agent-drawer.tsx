import * as React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Order } from "./schema";
import { agentService, type Agent } from "@/services/agent.service";
import { commandeService } from "@/services/commande.service";
import { toast } from "sonner";

export function AssignAgentDrawer({ order }: { order: Order }) {
    const isMobile = useIsMobile();
    const [agents, setAgents] = React.useState<Agent[]>([]);
    const [selectedAgentId, setSelectedAgentId] = React.useState<string | undefined>(undefined);
    const [loadingAgents, setLoadingAgents] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            fetchAgents();
        }
    }, [isOpen]);

    const fetchAgents = async () => {
        try {
            setLoadingAgents(true);
            // Assuming we might want to filter by status if the API supports it, e.g., { status: 'Actif' }
            // For now, we fetch all agents.
            const data = await agentService.getAllAgents();
            if (Array.isArray(data)) {
                setAgents(data);
            } else if (data && Array.isArray((data as any).results)) {
                setAgents((data as any).results);
            }

            // Try to pre-select the current agent if possible (need agent ID in order, currently using agentName)
            // If order has agent ID, we could pre-select it. 
            // For now, we leave it empty or user selects.
        } catch (error) {
            console.error("Failed to fetch agents", error);
            toast.error("Impossible de charger la liste des agents.");
        } finally {
            setLoadingAgents(false);
        }
    };

    const handleSave = async () => {
        if (!selectedAgentId) {
            toast.warning("Veuillez sélectionner un agent.");
            return;
        }

        try {
            setSaving(true);
            await commandeService.assignAgent(order.id, { agent_id: selectedAgentId });
            toast.success("Agent assigné avec succès !");
            setIsOpen(false);
            // Optionally trigger a refresh of the orders list here if needed
            // currently relying on parent to maybe refresh or user to reload
        } catch (error) {
            console.error("Failed to assign agent", error);
            toast.error("Erreur lors de l'assignation de l'agent.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground italic text-muted-foreground hover:text-primary">
                    {order.agent || "Non assigné"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Modifier l'agent assigné</DrawerTitle>
                    <DrawerDescription>
                        Sélectionnez un nouvel agent pour la commande {order.id}.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="agent">Agent</Label>
                            <Select value={selectedAgentId} onValueChange={setSelectedAgentId} disabled={loadingAgents}>
                                <SelectTrigger id="agent" className="w-full">
                                    <SelectValue placeholder={loadingAgents ? "Chargement..." : "Sélectionner un agent"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.map((agent) => (
                                        <SelectItem key={agent.id} value={String(agent.id)}>
                                            {agent.nom} {agent.prenom}
                                        </SelectItem>
                                    ))}
                                    {agents.length === 0 && !loadingAgents && (
                                        <SelectItem value="none" disabled>Aucun agent disponible</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSave} disabled={saving || loadingAgents}>
                        {saving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" disabled={saving}>Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
