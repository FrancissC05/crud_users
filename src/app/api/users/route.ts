import { prisma } from "@/lib/db";
import { userSchema } from "@/lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
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
        const body = await request.json();

        const {name, email} = userSchema.parse(body);

        const existingUser = await prisma.user.findUnique({where: { email }});

        if (existingUser) {
            return NextResponse.json(
                {error: "User already exists"}, 
                {status: 400}
            );
        }

        const users = await prisma.user.create({
            data: {name, email}
        });  
        return NextResponse.json({message: "User created succesfully",users});

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