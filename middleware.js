import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
   
    const token = await getToken({
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    });

    if(!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if(!token.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url)); 
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
}