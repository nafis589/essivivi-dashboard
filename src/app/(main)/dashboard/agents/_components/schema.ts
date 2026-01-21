import z from "zod";

export const agentSchema = z.object({
  identificationNumber: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  assignedTricycle: z.string(),
  status: z.string(),
  hireDate: z.string(),
});

