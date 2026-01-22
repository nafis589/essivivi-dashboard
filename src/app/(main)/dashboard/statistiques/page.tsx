import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionReports } from "./_components/production-reports";
import { StatisticalAnalysis } from "./_components/statistical-analysis";
import { FinancialReports } from "./_components/financial-reports";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Statistiques & Rapports</h1>
      </div>

      <Tabs className="gap-4" defaultValue="production">
        <TabsList>
          <TabsTrigger value="production">Rapports de Production</TabsTrigger>
          <TabsTrigger value="analytics">Analyses Statistiques</TabsTrigger>
          <TabsTrigger value="financial">Rapports Financiers</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <ProductionReports />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <StatisticalAnalysis />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
