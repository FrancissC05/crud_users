import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {assignedToId: null},
            include: {
                assignedTo: true,
            }
        });
        
        return NextResponse.json({users});
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const {name,email,assignedToId} = await request.json();
        const users = await prisma.user.create({
            data: {
                name,
                email,
                assignedToId: assignedToId || null
            }
        });
           
        return NextResponse.json({message: "User created succesfully",users});
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}