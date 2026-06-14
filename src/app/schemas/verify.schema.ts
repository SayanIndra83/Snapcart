import * as z from "zod"

export const VerifySchema = z.object({
    otp:z.string().length(6, "OTP must be of length 6")
})