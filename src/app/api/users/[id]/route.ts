import { prisma } from "@/lib/db";
import { userSchema } from "@/lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function PUT(request: NextRequest, {params}: Params) {
    try {
        const {id} = await params;
        
        const body = await request.json();

        const {name, email} = userSchema.parse(body);

        const userId = parseInt(id, 10);
        
        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await prisma.user.update({
            data : {
                name,
                email
            },
            where: {id: userId }
        });

        return NextResponse.json({message: "User updated successfully",user});

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return NextResponse.json({error: error.errors},{status: 400});
        }

        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function DELETE(_: NextRequest, {params}: Params) {
    try {
        const {id} = await params;

        const userId = parseInt(id, 10);
        
        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await prisma.user.delete({
            where: {id: userId }
        });

        return NextResponse.json({message: "User deleted successfully",user});

    } catch (error: any) {

        return NextResponse.json({error: error.message}, {status: 500});
    }
}