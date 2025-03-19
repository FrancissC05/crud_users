import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{id: string}>;
}

export async function GET(_:any, {params}: Params) {
    try {
        const {id} = await params;

        const ticket = await prisma.ticket.findUnique({
            where: {id},
            include: {
                user: {
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