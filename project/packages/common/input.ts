import { password } from "bun";
import {email, z} from "zod";

export const signupschema  = z.object({
    email: z.string(),
    password : z.string()
})