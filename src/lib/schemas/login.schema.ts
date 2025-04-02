import {z} from 'zod';

export const loginSchema = z.object({
    username: z.string().trim().nonempty("login name is required"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters")
});