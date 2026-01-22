import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const clientSchema = z.object({
  id: z.string(),
  nom_point_vente: z.string(),
  responsable: z.string(),
  telephone: z.string(),
  adresse: z.string(),
  email: z.string().optional().nullable().transform((v) => v ?? undefined),
  user_details: z.object({
    email: z.string().optional(),
  }).optional().nullable().transform((v) => v ?? undefined),
});
