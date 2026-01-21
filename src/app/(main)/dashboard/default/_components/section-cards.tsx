import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Agents actifs en tournée</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">24</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Équipe complète mobilisée <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Sur un total de 28 agents</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Livraisons du jour</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">142</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Performance élevée <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Objectif journalier dépassé</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Volume livré (m³)</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">3,500</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Demande en hausse <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Capacité stock suffisante</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recettes du jour</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">1,250,500 <span className="text-sm font-normal text-muted-foreground">FCFA</span></CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Excellent recouvrement <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">+8% par rapport à hier</div>
        </CardFooter>
      </Card>
    </div>
  );
}
