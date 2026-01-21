import z from "zod";

export const deliverySchema = z.object({
    id: z.string(),
    agentId: z.string(),
    agentName: z.string(),
    clientPhone: z.string(),
    clientName: z.string(),
    clientAddress: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    quantity: z.number(),
    amount: z.number(),
    date: z.string(),
    time: z.string(),
    duration: z.string(),
    status: z.enum(["Livré", "Annulé", "En cours", "Reporté"]),
});

export type Delivery = z.infer<typeof deliverySchema>;
