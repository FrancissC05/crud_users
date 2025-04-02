import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ["/api/auth/login", "/api/users", "/api/roles"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Si la ruta es pública, continuar
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // Buscar header Authorization
    const authHeader =
        request.headers.get("authorization") || request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("⛔ Token no proporcionado");
        return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    console.log("✅ Token presente en header:", pathname);
    return NextResponse.next(); // Permitir continuar
}

// Configuración del middleware
export const config = {
    matcher: ["/api/:path*"], // Proteger todas las rutas bajo /api
    // SIN runtime: "nodejs" para compatibilidad con Next.js estable
};
