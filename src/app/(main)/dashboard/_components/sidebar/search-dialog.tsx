"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChartBar,
  Fingerprint,
  Forklift,
  LayoutDashboard,
  Lock,
  Map,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  {
    group: "Général",
    items: [
      { width: "default", icon: LayoutDashboard, label: "Tableau de bord", url: "/dashboard/default" },
      { width: "default", icon: Users, label: "Agents", url: "/dashboard/agents" },
      { width: "default", icon: Users, label: "Clients", url: "/dashboard/clients" },
      { width: "default", icon: Forklift, label: "Livraisons", url: "/dashboard/livraisons" },
      { width: "default", icon: ShoppingBag, label: "Commandes", url: "/dashboard/commandes" },
      { width: "default", icon: ChartBar, label: "Statistiques & Rapports", url: "/dashboard/statistiques" },
      { width: "default", icon: Map, label: "Cartographie", url: "/dashboard/map" },
    ],
  },
  {
    group: "Administration",
    items: [
      { width: "default", icon: Lock, label: "Utilisateurs Admin", url: "/dashboard/admin-users" },
      { width: "default", icon: Settings, label: "Paramètres", url: "/dashboard/settings" },
      { width: "default", icon: ReceiptText, label: "Logs & Audit", url: "/dashboard/logs" },
      { width: "default", icon: Fingerprint, label: "Authentification", url: "/auth" },
    ],
  },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <Button
        variant="link"
        className="!px-0 font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Rechercher
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {searchItems.map((group, i) => (
            <React.Fragment key={group.group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    className="!py-1.5"
                    key={item.label}
                    onSelect={() => handleSelect(item.url)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
