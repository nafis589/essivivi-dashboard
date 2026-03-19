import { Client, PurchaseHistoryItem } from './types'

export const mockClients: Client[] = [
    {
        id: 1,
        name: 'Sophie Martin',
        phone: '0612345678',
        email: 'sophie.martin@example.com',
        address: '12 Rue de la Paix, Paris',
        totalPurchases: 15,
        totalSpent: 1250.50,
        lastPurchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // il y a 2 jours
        createdAt: new Date('2023-01-15')
    },
    {
        id: 2,
        name: 'Lucas Dupont',
        phone: '0798765432',
        email: 'lucas.dupont@example.com',
        address: '45 Avenue Jean Jaurès, Lyon',
        totalPurchases: 3,
        totalSpent: 145.00,
        lastPurchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // il y a 45 jours
        createdAt: new Date('2023-11-20'),
        notes: 'Client VIP'
    },
    {
        id: 3,
        name: 'Emma Bernard',
        phone: '0655443322',
        email: 'emma.bernard@example.com',
        totalPurchases: 0,
        totalSpent: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // il y a 5 jours
    },
    {
        id: 4,
        name: 'Thomas Leroy',
        phone: '0611223344',
        totalPurchases: 42,
        totalSpent: 3500.75,
        lastPurchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date('2022-05-10')
    },
    {
        id: 5,
        name: 'Julie Roux',
        email: 'j.roux@example.com',
        address: '8 Boulevard Haussmann, Paris',
        totalPurchases: 8,
        totalSpent: 450.20,
        lastPurchaseDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // il y a 120 jours (inactif)
        createdAt: new Date('2023-03-01')
    },
    { id: 6, name: 'Antoine Moreau', phone: '0766554433', totalPurchases: 1, totalSpent: 25.0, lastPurchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), createdAt: new Date('2024-01-10') },
    { id: 7, name: 'Camille Petit', email: 'camille@example.com', phone: '0699887766', totalPurchases: 24, totalSpent: 2100.0, lastPurchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date('2022-11-05') },
    { id: 8, name: 'Nicolas Girard', phone: '0677889900', totalPurchases: 2, totalSpent: 89.9, lastPurchaseDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-09-12') },
    { id: 9, name: 'Laura Simon', email: 'laura.s@example.com', totalPurchases: 5, totalSpent: 300.5, lastPurchaseDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-08-30') },
    { id: 10, name: 'Maxime Michel', phone: '0612349876', totalPurchases: 11, totalSpent: 850.0, lastPurchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-05-15') },
    { id: 11, name: 'Chloé Lefevre', email: 'c.lefevre@example.com', address: 'Bordeaux', totalPurchases: 32, totalSpent: 2800.0, lastPurchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), createdAt: new Date('2022-01-20'), notes: 'Aime les produits bio' },
    { id: 12, name: 'Alexandre David', phone: '0711223355', totalPurchases: 4, totalSpent: 120.0, lastPurchaseDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-02-14') },
    { id: 13, name: 'Mathilde Richard', email: 'mathilde.r@example.com', phone: '0655889922', totalPurchases: 7, totalSpent: 620.0, lastPurchaseDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-06-18') },
    { id: 14, name: 'Pierre Laurent', totalPurchases: 1, totalSpent: 45.0, lastPurchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-10-05') },
    { id: 15, name: 'Marie Garnier', phone: '0699001122', totalPurchases: 19, totalSpent: 1550.0, lastPurchaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), createdAt: new Date('2022-08-22') },
    { id: 16, name: 'Paul Chevalier', email: 'paul.c@example.com', totalPurchases: 2, totalSpent: 90.0, lastPurchaseDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-04-11') },
    { id: 17, name: 'Céline Leroy', phone: '0733445566', totalPurchases: 50, totalSpent: 4200.0, lastPurchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), createdAt: new Date('2021-12-01') },
    { id: 18, name: 'Guillaume Blanc', email: 'g.blanc@example.com', phone: '0622334455', totalPurchases: 3, totalSpent: 175.0, lastPurchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-12-05') },
    { id: 19, name: 'Élise Francois', phone: '0788990011', totalPurchases: 0, totalSpent: 0, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 20, name: 'Julien Perrin', email: 'julien.p@example.com', totalPurchases: 6, totalSpent: 430.0, lastPurchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), createdAt: new Date('2023-07-25') },
]

export const mockPurchaseHistory: Record<number, PurchaseHistoryItem[]> = {
    1: [
        { id: 'V-2024-001', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), amount: 150.0, paymentMethod: 'carte', itemsCount: 3 },
        { id: 'V-2024-045', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), amount: 280.5, paymentMethod: 'carte', itemsCount: 2 },
        { id: 'V-2023-890', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), amount: 45.0, paymentMethod: 'especes', itemsCount: 1 },
    ],
    2: [
        { id: 'V-2023-950', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), amount: 145.0, paymentMethod: 'carte', itemsCount: 4 },
    ],
    4: [
        { id: 'V-2024-005', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), amount: 450.0, paymentMethod: 'virement', itemsCount: 5 },
        { id: 'V-2024-012', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), amount: 120.0, paymentMethod: 'carte', itemsCount: 1 },
        { id: 'V-2023-700', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: 300.0, paymentMethod: 'carte', itemsCount: 2 },
        { id: 'V-2023-500', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), amount: 850.0, paymentMethod: 'carte', itemsCount: 10 },
    ]
}
