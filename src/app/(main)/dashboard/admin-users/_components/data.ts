import type { AdminUser } from "./schema";

export const adminUsersData: AdminUser[] = [
    {
        id: "ADM-001",
        name: "Jean Admin",
        email: "jean.admin@essivivi.com",
        role: "Super Admin",
        status: "Actif",
        lastConnection: "2024-05-20 08:30",
    },
    {
        id: "ADM-002",
        name: "Marie Gestion",
        email: "marie.gestion@essivivi.com",
        role: "Gestionnaire",
        status: "Actif",
        lastConnection: "2024-05-19 14:15",
    },
    {
        id: "ADM-003",
        name: "Paul Super",
        email: "paul.super@essivivi.com",
        role: "Superviseur",
        status: "Inactif",
        lastConnection: "2024-04-10 09:00",
    },
    {
        id: "ADM-004",
        name: "Alice Tech",
        email: "alice.tech@essivivi.com",
        role: "Super Admin",
        status: "Actif",
        lastConnection: "2024-05-20 10:45",
    },
];
