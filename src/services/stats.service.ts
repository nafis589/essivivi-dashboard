
import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
    // General overview stats
    total_deliveries: number;
    total_quantity: number;
    total_amount: number;
    delivery_growth: number; // percentage
    quantity_growth: number;
    amount_growth: number;
}

export interface AgentPerformance {
    agent_id: string;
    agent_name: string;
    deliveries_count: number;
    quantity_delivered: number;
    total_amount: number;
    status: "Top Performer" | "Excellent" | "Bon" | "Moyen" | "Faible";
}

export interface ProductionStatData {
    date: string; // or period name
    value: number;
}

export interface ProductionStats {
    sales_over_time: ProductionStatData[]; // For charts
    peak_hours: { hour: string; sales: number }[];
    top_zones: { zone: string; value: number }[];
}

export interface FinancialReportItem {
    period: string;
    revenue: number;
    target: number;
    variation: number; // percentage
}

export interface ClientDebt {
    client_name: string;
    amount_due: number;
    due_date: string;
}

export interface FinancialStats {
    revenue_vs_target: {
        global: { current: number; target: number };
        tricycles: { current: number; target: number };
        wholesale: { current: number; target: number };
    };
    debts: ClientDebt[];
    revenue_history: FinancialReportItem[];
}

export const statsService = {
    getDashboardStats: async () => {
        const response = await apiClient.get<DashboardStats>("/dashboard/stats/");
        console.log("getDashboardStats response:", response);
        // Handle case where data might be nested in 'data' or 'stats' or 'results'
        const data = (response.data as any)?.data ?? (response.data as any)?.stats ?? response.data;
        return data;
    },

    getProductionStats: async (period: number = 30) => {
        const response = await apiClient.get<ProductionStats>("/dashboard/production/", {
            params: { period },
        });
        console.log("getProductionStats response:", response);
        const data = (response.data as any)?.data ?? response.data;
        return data;
    },

    getAgentPerformance: async (limit: number = 10) => {
        const response = await apiClient.get("/dashboard/performance-agents/", {
            params: { limit },
        });
        console.log("getAgentPerformance response:", response);
        // Handle DRF pagination (results) or standard wrapped response
        return (response.data as any)?.results ?? (response.data as any)?.data ?? response.data;
    },

    getFinancialReports: async (period: "daily" | "monthly" = "daily") => {
        const response = await apiClient.get<FinancialStats>("/dashboard/financial/", {
            params: { period },
        });
        console.log("getFinancialReports response:", response);
        const data = (response.data as any)?.data ?? response.data;
        return data;
    },
};
