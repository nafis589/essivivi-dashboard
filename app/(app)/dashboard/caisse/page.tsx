import { Metadata } from "next";
import { POSLayout } from "@/components/modules/pos/POSLayout";

export const metadata: Metadata = {
  title: "Caisse (POS) | FlowCommerce",
  description: "Point de vente pour la gestion des encaissements",
};

export default function POSPage() {
  return (
    <div className="h-full w-full">
      <POSLayout />
    </div>
  );
}
