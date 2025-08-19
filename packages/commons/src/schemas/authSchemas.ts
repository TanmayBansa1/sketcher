import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
});

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export const decodedTokenSchema = z.object({
    sub: z.string(),
    exp: z.number(),
    iat: z.number(),
    nbf: z.number(),
    jti: z.string(),
    azp: z.string(),
});
export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type DecodedTokenSchema = z.infer<typeof decodedTokenSchema>;