import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const deliverySchema = z.object({
    id: z.string(),
    commande: z.string().optional(),
    agent: z.string().optional(),
    statut: z.string().optional(),
    is_validated: z.boolean().optional(),
    date_livraison: z.string().optional(),
});

export type Delivery = z.infer<typeof deliverySchema>;
