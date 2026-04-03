import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Sale } from './types';

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('XOF', 'FCFA');
};

export const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
};

export const calculateStats = (sales: Sale[]) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    const todaySales = sales.filter(s => format(new Date(s.createdAt), 'yyyy-MM-dd') === today);
    const totalRevenue = sales.filter(s => s.status === 'COMPLETED').reduce((acc, sale) => Math.max(0, acc + sale.total), 0);

    return {
        totalSalesCount: sales.length,
        totalRevenue,
        todaySalesCount: todaySales.length,
        averageSaleAmount: sales.length > 0 ? totalRevenue / sales.length : 0
    };
};

// Export to CSV helper
export const exportToCSV = (sales: Sale[]) => {
    const headers = ['Nº Facture', 'Date', 'Client', 'Articles', 'Sous-total', 'Taxes', 'Total', 'Paiement', 'Statut'];
    const rows = sales.map(s => [
        s.invoiceNumber,
        formatDateTime(s.createdAt),
        s.customer?.name || 'Anonyme',
        (s.items || []).reduce((acc, item) => acc + item.quantity, 0).toString(),
        s.subtotal.toFixed(2),
        s.tax.toFixed(2),
        s.total.toFixed(2),
        s.payments?.[0]?.method || '',
        s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(',') + '\n'
        + rows.map(e => e.join(',')).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ventes_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
