import { Sale, SaleStatus, PaymentMethod } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';

const statuses: SaleStatus[] = ['paid', 'paid', 'paid', 'refunded', 'pending', 'partially_refunded'];
const paymentMethods: PaymentMethod[] = ['cash', 'mobile', 'card'];

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
                id: `item-${i}-${j}`,
                productId: `prod-${j}`,
                name: `Produit ${Math.floor(Math.random() * 100)}`,
                quantity: qty,
                unitPrice: price,
                total: total,
                refundedQuantity: i === 4 ? 1 : 0
            });
        }

        const taxes = subtotal * 0.1; // 10% tax
        const totalAmount = subtotal + taxes;
        const date = subHours(subMinutes(subDays(now, Math.floor(Math.random() * 30)), Math.floor(Math.random() * 60)), Math.floor(Math.random() * 24)).toISOString();

        sales.push({
            id: `sale-${i}`,
            invoiceNumber: `F2024-${i.toString().padStart(5, '0')}`,
            date: date,
            customer: isAnonymous ? null : {
                id: `cust-${i}`,
                name: `Client ${i}`,
                phone: `+33 6 ${Math.floor(10000000 + Math.random() * 90000000)}`
            },
            items,
            subtotal,
            taxes,
            total: totalAmount,
            paymentMethod: paymentMethods[i % paymentMethods.length],
            status: statuses[i % statuses.length],
            refundReason: i === 4 ? "Produit défectueux" : undefined
        });
    }

    // Sort by date descending
    return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_SALES = generateMockData();
