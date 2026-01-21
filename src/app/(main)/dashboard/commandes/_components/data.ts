import type { Order } from "./schema";

export const ordersData: Order[] = [
    {
        id: "CMD-001",
        date: "2024-05-21",
        clientName: "Boutique Abla",
        quantity: 50,
        status: "Livrée",
        agentName: "Koffi Mensah",
    },
    {
        id: "CMD-002",
        date: "2024-05-21",
        clientName: "Maquis 228",
        quantity: 100,
        status: "En cours",
        agentName: "Ama Doe",
    },
    {
        id: "CMD-003",
        date: "2024-05-22",
        clientName: "Superette Yovo",
        quantity: 30,
        status: "En attente",
        agentName: "Assignation en cours...",
    },
    {
        id: "CMD-004",
        date: "2024-05-22",
        clientName: "Resto Chez Tantie",
        quantity: 75,
        status: "Annulée",
        agentName: "Yao Paul",
    },
    {
        id: "CMD-005",
        date: "2024-05-23",
        clientName: "Depot Boisson",
        quantity: 200,
        status: "Acceptée",
        agentName: "Ama Doe",
    },
    {
        id: "CMD-006",
        date: "2024-05-23",
        clientName: "Hotel Sarakawa",
        quantity: 150,
        status: "En cours",
        agentName: "Koffi Mensah",
    },
];
