import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().trim().nonempty("First name is required"),
    lastName: z.string().trim().nonempty("Last name is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    username: z.string().trim().nonempty("Username is required").min(3, "Username must be at least 3 characters"),
    password: z.string().nonempty("Pass is required").min(6, "Password must be at least 6 characters"),
    isActive: z.boolean().default(true),
    roles: z.array(z.number()).nonempty("At least one role is required")
});