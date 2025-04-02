import {z} from 'zod';

export const roleSchema = z.object({
    name: z.string().trim().nonempty("Role name is required")
});