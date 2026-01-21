import z from "zod";

export const clientSchema = z.object({
  clientCode: z.string(),
  posName: z.string(),
  manager: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  gpsCoordinates: z.string(),
  registrationDate: z.string(),
  status: z.enum(["Actif", "Inactif"]),
});
