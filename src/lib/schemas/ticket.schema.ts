import {z} from 'zod';

export const ticketSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    status: z.enum(['TODO','IN_PROGRESS', 'DONE']),
    assignedTo: z.number()
});