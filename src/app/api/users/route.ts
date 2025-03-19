import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
        const {name,email} = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                {error: "Name and email are required"}, 
                {status: 400}
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

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
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        );
    }
}