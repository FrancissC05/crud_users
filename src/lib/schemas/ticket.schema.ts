import {z} from 'zod';

export const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(['TODO','IN_PROGRESS', 'DONE']),
    assignedTo: z.number()
});