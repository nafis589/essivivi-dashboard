import type { clientSchema } from "./schema";
import type z from "zod";

export const clientsData: z.infer<typeof clientSchema>[] = [
  {
    clientCode: "CLT-1001",
    posName: "Boutique Alpha",
    manager: "Koffi Akpo",
    phoneNumber: "90 12 34 56",
    address: "Lomé, Quartier Adidogomé",
    gpsCoordinates: "6.1366, 1.2222",
    registrationDate: "12/01/2024",
    status: "Actif",
  },
  {
    clientCode: "CLT-1002",
    posName: "Supermarché Délice",
    manager: "Afi Mensah",
    phoneNumber: "91 98 76 54",
    address: "Kpalimé, Centre ville",
    gpsCoordinates: "6.9066, 0.6314",
    registrationDate: "15/02/2024",
    status: "Actif",
  },
  {
    clientCode: "CLT-1003",
    posName: "Kiosque Espoir",
    manager: "Kodjo T",
    phoneNumber: "92 55 44 33",
    address: "Lomé, Bè",
    gpsCoordinates: "6.1256, 1.2543",
    registrationDate: "05/11/2023",
    status: "Inactif",
  },
  {
    clientCode: "CLT-1004",
    posName: "Pharmacie Verte",
    manager: "Dr. Kossi",
    phoneNumber: "99 11 22 33",
    address: "Atakpamé",
    gpsCoordinates: "7.5298, 1.1306",
    registrationDate: "10/03/2024",
    status: "Actif",
  },
  {
    clientCode: "CLT-1005",
    posName: "Maquis Le Goût",
    manager: "Fati",
    phoneNumber: "93 33 22 11",
    address: "Sokodé",
    gpsCoordinates: "8.9833, 1.1333",
    registrationDate: "20/12/2023",
    status: "Inactif",
  },
];

// Chart configs
export const leadsBySourceChartConfig = {
  "Direct": { label: "Direct", color: "hsl(var(--chart-1))" },
  "Partner": { label: "Partner", color: "hsl(var(--chart-2))" },
  "Referral": { label: "Referral", color: "hsl(var(--chart-3))" },
};

export const leadsBySourceChartData = [
  { source: "Direct", leads: 120, fill: "hsl(var(--chart-1))" },
  { source: "Partner", leads: 85, fill: "hsl(var(--chart-2))" },
  { source: "Referral", leads: 45, fill: "hsl(var(--chart-3))" },
];

export const projectRevenueChartConfig = {
  "Q1": { label: "Q1 2024", color: "hsl(var(--chart-1))" },
  "Q2": { label: "Q2 2024", color: "hsl(var(--chart-2))" },
  "Q3": { label: "Q3 2024", color: "hsl(var(--chart-3))" },
  "Q4": { label: "Q4 2024", color: "hsl(var(--chart-4))" },
};

export const projectRevenueChartData = [
  { quarter: "Q1", revenue: 150000, fill: "hsl(var(--chart-1))" },
  { quarter: "Q2", revenue: 200000, fill: "hsl(var(--chart-2))" },
  { quarter: "Q3", revenue: 175000, fill: "hsl(var(--chart-3))" },
  { quarter: "Q4", revenue: 220000, fill: "hsl(var(--chart-4))" },
];

export const leadsChartConfig = {
  "Jan": { label: "January", color: "hsl(var(--chart-1))" },
  "Feb": { label: "February", color: "hsl(var(--chart-2))" },
  "Mar": { label: "March", color: "hsl(var(--chart-3))" },
};

export const leadsChartData = [
  { month: "Jan", leads: 45 },
  { month: "Feb", leads: 52 },
  { month: "Mar", leads: 48 },
];

export const proposalsChartConfig = {
  "Pending": { label: "Pending", color: "hsl(var(--chart-1))" },
  "Approved": { label: "Approved", color: "hsl(var(--chart-2))" },
  "Rejected": { label: "Rejected", color: "hsl(var(--chart-3))" },
};

export const proposalsChartData = [
  { status: "Pending", count: 12, fill: "hsl(var(--chart-1))" },
  { status: "Approved", count: 28, fill: "hsl(var(--chart-2))" },
  { status: "Rejected", count: 5, fill: "hsl(var(--chart-3))" },
];

export const revenueChartConfig = {
  "Week1": { label: "Week 1", color: "hsl(var(--chart-1))" },
  "Week2": { label: "Week 2", color: "hsl(var(--chart-2))" },
  "Week3": { label: "Week 3", color: "hsl(var(--chart-3))" },
  "Week4": { label: "Week 4", color: "hsl(var(--chart-4))" },
};

export const revenueChartData = [
  { week: "Week 1", revenue: 50000 },
  { week: "Week 2", revenue: 65000 },
  { week: "Week 3", revenue: 55000 },
  { week: "Week 4", revenue: 70000 },
];

export const actionItems = [
  { id: 1, title: "Follow up with Client A", priority: "High", dueDate: "2024-05-25" },
  { id: 2, title: "Review Q2 Reports", priority: "Medium", dueDate: "2024-05-28" },
  { id: 3, title: "Team Meeting Preparation", priority: "Medium", dueDate: "2024-05-26" },
];

export const regionSalesData = [
  { region: "North", sales: 120000, isPositive: true },
  { region: "South", sales: 95000, isPositive: false },
  { region: "East", sales: 145000, isPositive: true },
  { region: "West", sales: 110000, isPositive: true },
];

export const salesPipelineChartConfig = {
  "Prospecting": { label: "Prospecting", color: "hsl(var(--chart-1))" },
  "Qualified": { label: "Qualified", color: "hsl(var(--chart-2))" },
  "Proposal": { label: "Proposal", color: "hsl(var(--chart-3))" },
  "Closed": { label: "Closed", color: "hsl(var(--chart-4))" },
};

export const salesPipelineChartData = [
  { stage: "Prospecting", deals: 35, fill: "hsl(var(--chart-1))" },
  { stage: "Qualified", deals: 28, fill: "hsl(var(--chart-2))" },
  { stage: "Proposal", deals: 15, fill: "hsl(var(--chart-3))" },
  { stage: "Closed", deals: 8, fill: "hsl(var(--chart-4))" },
];
