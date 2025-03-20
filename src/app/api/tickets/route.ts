import { prisma } from "@/lib/db";
import { ticketSchema } from "@/lib/schemas/ticket.schema";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
    try {
        const tickets = await prisma.ticket.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                }
                }
            }
        });
        return NextResponse.json({tickets});
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}

export async function POST(request: any) {
    try {
        const body = await request.json();

        const {title,description,status,assignedTo} = ticketSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: assignedTo }
        });

        if (!user) {
            return NextResponse.json(
                {error: "User not found"}, 
                {status: 404}
            );
        }

        const ticket = await prisma.ticket.create({
            data: {
                title, 
                description, 
                status,
                userId: assignedTo
            }
        });  
        return NextResponse.json({message: "Ticket created succesfully",ticket});

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return NextResponse.json({error: error.errors},{status: 400});
        }

        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}