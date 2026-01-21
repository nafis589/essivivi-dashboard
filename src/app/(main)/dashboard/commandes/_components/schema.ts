import z from "zod";

export const orderSchema = z.object({
  id: z.string(),
  date: z.string(),
  clientName: z.string(),
  quantity: z.number(),
  status: z.enum(["En attente", "Acceptée", "En cours", "Livrée", "Annulée"]),
  agentName: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema>;
