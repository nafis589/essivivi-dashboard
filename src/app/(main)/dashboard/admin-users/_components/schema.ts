import z from "zod";

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["Super Admin", "Gestionnaire", "Superviseur"]),
  status: z.enum(["Actif", "Inactif"]),
  lastConnection: z.string(),
});

export type AdminUser = z.infer<typeof adminUserSchema>;
