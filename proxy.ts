import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionToken = request.cookies.get("session_token")?.value

    // Allow public routes
    if (publicRoutes.some((route) => pathname === route)) {
        // Redirect logged-in users away from auth pages
        if (sessionToken && ["/login", "/register"].includes(pathname)) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next()
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            const loginUrl = new URL("/login", request.url)
            loginUrl.searchParams.set("redirect", pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
}
