import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET(_: any, {params}: {params: Params}) {
    try {
        const {id} = params;
        const user = await prisma.user.findUnique({
            where: { id }
            
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