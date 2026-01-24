import z from "zod";

// Schema aligned with backend API fields from essivi_custom_collection.json
export const clientSchema = z.object({
  id: z.string().optional(),
  clientCode: z.string().optional(),
  nom_point_vente: z.string().optional(),
  posName: z.string().optional(),
  responsable: z.string().optional(),
  manager: z.string().optional(),
  telephone: z.string().optional(),
  phoneNumber: z.string().optional(),
  adresse: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional().nullable().transform((v) => v ?? undefined),
  user_details: z.object({
    email: z.string().optional(),
  }).optional().nullable().transform((v) => v ?? undefined),
  gpsCoordinates: z.string().optional(),
  registrationDate: z.string().optional(),
  status: z.string().optional(),
});
