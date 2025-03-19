import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
        const {title,description,status,assignedTo} = await request.json();

        if (!title || !description || /*!status ||*/ !assignedTo) {
            return NextResponse.json(
                {error: "Title, description and assignedTo are required"}, 
                {status: 400}
            );
        }

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
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}