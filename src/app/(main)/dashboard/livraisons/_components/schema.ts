import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const deliverySchema = z.object({
    id: z.string(),
    commande: z.string().optional(),
    agent: z.string().optional(),
    agentName: z.string().optional(),
    clientPhone: z.string().optional(),
    clientName: z.string().optional(),
    clientAddress: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    quantity: z.number().optional(),
    amount: z.number().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    duration: z.string().optional(),
    statut: z.string().optional(),
    is_validated: z.boolean().optional(),
    date_livraison: z.string().optional(),
});

export type Delivery = z.infer<typeof deliverySchema>;
