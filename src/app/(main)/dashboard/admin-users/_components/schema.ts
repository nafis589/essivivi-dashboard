import z from "zod";

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["Super Admin", "Gestionnaire", "Superviseur"]),
  status: z.enum(["Actif", "Inactif"]),
  lastConnection: z.string(),
  company: z.string().optional(),
  source: z.string().optional(),
  lastActivity: z.string().optional(),
});

export const recentLeadSchema = adminUserSchema;

export type AdminUser = z.infer<typeof adminUserSchema>;
