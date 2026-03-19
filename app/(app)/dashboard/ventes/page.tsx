import { SalesPage } from "@/components/modules/ventes/SalesPage";

export const metadata = {
  title: "Ventes | FlowCommerce",
  description: "Historique de vos transactions",
};

export default function Ventes() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <SalesPage />
    </div>
  );
}
