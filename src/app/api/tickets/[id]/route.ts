import { prisma } from "@/lib/db";
import { ticketSchema } from "@/lib/schemas/ticket.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Params {
    params: Promise<{id: string}>;
}

export async function GET(_:any, {params}: Params) {
    try {
        const {id} = await params;

        const ticket = await prisma.ticket.findUnique({
            where: {id},
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

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json(ticket);

    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}

export async function PUT(request: NextRequest, {params}: Params) {
    try {
        const {id} = await params;
        const body = await request.json();

        const {title,description,status,assignedTo} = ticketSchema.parse(body);

        const existingTicket = await prisma.ticket.findUnique({
            where: {id}
        });

        if (!existingTicket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const ticket = await prisma.ticket.update({
            data: {
                title,
                description,
                status,
                assignedTo: {
                    connect: {id: assignedTo}
                }
            }, 
            where: {id}
            
        });

        return NextResponse.json({message: "Ticket updated succesfully",ticket});

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