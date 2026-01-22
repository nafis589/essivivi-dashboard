import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const orderSchema = z.object({
  id: z.string(),
  client: z.string(),
  qt_commandee: z.number(),
  statut: z.string().optional(),
  date_creation: z.string().optional(),
  agent: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema>;
