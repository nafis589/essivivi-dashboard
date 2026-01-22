import type { Order } from "./schema";

export const ordersData: Order[] = [
    {
        id: "CMD-001",
        date_creation: "2024-05-21",
        client: "CLT-001", // Using ID or Name depending on what 'client' field holds
        qt_commandee: 50,
        statut: "Livrée",
        agent: "AG-001",
    },
    {
        id: "CMD-002",
        date_creation: "2024-05-21",
        client: "CLT-002",
        qt_commandee: 100,
        statut: "En cours",
        agent: "AG-002",
    },
    {
        id: "CMD-003",
        date_creation: "2024-05-22",
        client: "CLT-003",
        qt_commandee: 30,
        statut: "En attente",
        agent: "AG-003",
    },
    {
        id: "CMD-004",
        date_creation: "2024-05-22",
        client: "CLT-004",
        qt_commandee: 75,
        statut: "Annulée",
        agent: "AG-004",
    },
    {
        id: "CMD-005",
        date_creation: "2024-05-23",
        client: "CLT-005",
        qt_commandee: 200,
        statut: "Acceptée",
        agent: "AG-002",
    },
    {
        id: "CMD-006",
        date_creation: "2024-05-23",
        client: "CLT-006",
        qt_commandee: 150,
        statut: "En cours",
        agent: "AG-001",
    },
];
