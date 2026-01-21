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

export function AssignAgentDrawer({ order }: { order: Order }) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground italic text-muted-foreground hover:text-primary">
                    {order.agentName || "Non assigné"}
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
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="agent">Agent</Label>
                            <Select defaultValue={order.agentName}>
                                <SelectTrigger id="agent" className="w-full">
                                    <SelectValue placeholder="Sélectionner un agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Koffi Mensah">Koffi Mensah</SelectItem>
                                    <SelectItem value="Ama Doe">Ama Doe</SelectItem>
                                    <SelectItem value="Yao Paul">Yao Paul</SelectItem>
                                    <SelectItem value="Assignation en cours...">Assignation en cours...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Enregistrer</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
