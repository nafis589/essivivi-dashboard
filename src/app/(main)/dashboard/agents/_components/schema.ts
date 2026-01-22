import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const agentSchema = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  telephone: z.string(),
  email: z.string().optional().nullable().transform((v) => v ?? undefined),
  tricycle_assigne: z.string().optional().nullable().transform((v) => v ?? undefined),
  statut: z.string().optional().nullable().transform((v) => v ?? undefined),
  date_embauche: z.string().optional().nullable().transform((v) => v ?? undefined),
  user_details: z.object({
    email: z.string().optional(),
  }).optional().nullable().transform((v) => v ?? undefined),
});

