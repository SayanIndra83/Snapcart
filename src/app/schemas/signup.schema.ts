import * as z from "zod"

export const SignUpSchema = z.object({
    username: z.string(),
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z
    .string()
    .min(6, {message: "Password must be atleast 6 charracters long"})
    .max(10, {message:"Password must be no more than 10 charracters"})
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    mobile:z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {message: "Please enter a valid phone number"})
})