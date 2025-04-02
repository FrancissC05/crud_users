import { prisma } from "@/lib/db";
import { roleSchema } from "@/lib/schemas/role.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return NextResponse.json({ roles });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name } = roleSchema.parse(body);

        const existingRole = await prisma.role.findFirst({
            where: {
                name,
            },
        });

        if (existingRole) {
            return NextResponse.json(
                { error: "Role already exists" },
                { status: 400 }
            );
        }

        const role = await prisma.role.create({
            data: {
                name,
            },
        });

        return NextResponse.json({ message: "Role created succesfully" , role });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

