import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Máximo 500 caracteres").optional(),
  profileImageUrl: z.string().url("URL inválida").or(z.literal("")).optional(),
});

export const passwordSchema = z.object({
  current: z.string().min(1, "Requerido"),
  next: z.string().min(6, "Mínimo 6 caracteres"),
});
