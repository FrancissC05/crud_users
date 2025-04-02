import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "@/lib/types/jwt-payload";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const userId = decoded.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ profile: user }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Internal server error",
        }, { status: 500 });
    }
}

















/*
export async function GET(request: NextRequest) {
    // Log detallado de todos los encabezados
    return NextResponse.json({ message: "Profile route is working!" });


    try {
        
        
        if (!userId) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ profile: user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}*/