import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{id: string}>;
}

export async function GET(_:any, {params}: Params) {
    try {
        const {id} = await params;
        const userId = parseInt(id, 10);
        
        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {id: userId },
            include: {
                tickets: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        description: true
                    }
                }
            }
            
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error: any) {
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}