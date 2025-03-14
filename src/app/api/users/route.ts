import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
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