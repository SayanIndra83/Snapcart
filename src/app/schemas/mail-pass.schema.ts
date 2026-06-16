import * as z from"zod"

export const PassSchema = z.object({
password: z
    .string()
    .min(8, {message: "Password must be atleast 8 charracters long"})
    .max(16, {message:"Password must be no more than 16 charracters"})
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
})

export const MailSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
})