import { Sale, SaleStatus, PaymentMethod } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';

const statuses: SaleStatus[] = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'PENDING', 'CANCELLED'];
const paymentMethods: PaymentMethod[] = ['CASH', 'MOBILE_MONEY', 'CARD'];

const generateMockData = (): Sale[] => {
    const sales: Sale[] = [];
    const now = new Date();

    for (let i = 1; i <= 30; i++) {
        const isAnonymous = Math.random() > 0.6;
        const itemsCount = Math.floor(Math.random() * 5) + 1;
        let subtotal = 0;
        const items = [];

        for (let j = 1; j <= itemsCount; j++) {
            const price = Math.floor(Math.random() * 50) + 10;
            const qty = Math.floor(Math.random() * 3) + 1;
            const total = price * qty;
            subtotal += total;

            items.push({
                id: i * 100 + j,
                productId: j,
                name: `Produit ${Math.floor(Math.random() * 100)}`,
                quantity: qty,
                price: price,
                total: total,
                refundedQuantity: i === 4 ? 1 : 0
            });
        }

        const taxes = subtotal * 0.1; // 10% tax
        const totalAmount = subtotal + taxes;
        const date = subHours(subMinutes(subDays(now, Math.floor(Math.random() * 30)), Math.floor(Math.random() * 60)), Math.floor(Math.random() * 24)).toISOString();

        sales.push({
            id: i,
            invoiceNumber: `F2024-${i.toString().padStart(5, '0')}`,
            createdAt: date,
            customer: isAnonymous ? null : {
                id: i,
                name: `Client ${i}`,
                phone: `+33 6 ${Math.floor(10000000 + Math.random() * 90000000)}`
            },
            items,
            subtotal,
            tax: taxes,
            total: totalAmount,
            payments: [{ method: paymentMethods[i % paymentMethods.length], amount: totalAmount }],
            status: statuses[i % statuses.length],
            userId: "user-uuid"
        });
    }

    // Sort by date descending
    return sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_SALES = generateMockData();

