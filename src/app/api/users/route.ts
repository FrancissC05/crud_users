import { prisma } from "@/lib/db";
import { userSchema } from "@/lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                roles: {
                    select: {
                        id: true,
                        name: true
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

        const { firstName, lastName, email, username, password, isActive, roles } =
            userSchema.parse(body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email or username already in use" },
                { status: 400 }
            );
        }

        const foundRoles = await prisma.role.findMany({
            where: {
                id: { in: roles },
            },
        });

        if (foundRoles.length !== roles.length) {
            return NextResponse.json(
                { error: "One or more roles do not exist" },
                { status: 404 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Password is invalid" },
                { status: 400 }
            );
        }

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                roles: {
                    connect: foundRoles.map((role) => ({id: role.id})),
                },
                isActive,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                isActive: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return NextResponse.json({ message: "User created succesfully", user: newUser });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}