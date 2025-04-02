import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/schemas/login.schema";
import { JwtPayload } from "@/lib/types/jwt-payload";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { username, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {username},
            include: {
                roles: {
                    select: {
                        id: true,
                        name: true,
                    },

                },
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: "User is not active" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const payload: JwtPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
        };        

        //const expiresIn = (process.env.JWT_EXPIRES_IN || "1h") as string;
        
        const secret = process.env.JWT_SECRET as string;

        const token = jwt.sign( payload, secret, {
            expiresIn: "1m",
        });

        return NextResponse.json({ token} , {status: 200});
    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}