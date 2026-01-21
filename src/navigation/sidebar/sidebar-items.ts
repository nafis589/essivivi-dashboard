import {
  Banknote,
  Calendar,
  ChartBar,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Mail,
  Map,
  MessageSquare,
  ReceiptText,
  Settings,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Général",
    items: [
      {
        title: "Tableau de bord",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Agents",
        url: "/dashboard/agents",
        icon: Users,
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
      },
      {
        title: "Livraisons",
        url: "/dashboard/livraisons",
        icon: Forklift,
      },
      {
        title: "Commandes",
        url: "/dashboard/commandes",
        icon: ShoppingBag,
      },
      {
        title: "Statistiques & Rapports",
        url: "/dashboard/statistiques",
        icon: ChartBar,
      },
      {
        title: "Cartographie",
        url: "/dashboard/map",
        icon: Map,
      },
    ],
  },
  {
    id: 2,
    label: "Administration",
    items: [
      {
        title: "Utilisateurs Admin",
        url: "/dashboard/admin-users",
        icon: Lock,
      },
      {
        title: "Paramètres",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Logs & Audit",
        url: "/dashboard/logs",
        icon: ReceiptText,
      },
      {
        title: "Authentification",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Déconnexion", url: "/auth/v2/login", newTab: false }
        ]
      }
    ],
  },
];
