import { cookies } from "next/headers"
import { db, sessions, users } from "@/lib/db"
import { eq, and, gt } from "drizzle-orm"
import crypto from "crypto"

const SESSION_COOKIE_NAME = "session_token"
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

export async function createSession(userId: string) {
    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

    await db.insert(sessions).values({
        userId,
        token,
        expiresAt,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    })

    return token
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    const result = await db
        .select({
            session: sessions,
            user: users,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
        .limit(1)

    if (result.length === 0) {
        return null
    }

    return {
        session: result[0].session,
        user: result[0].user,
    }
}

export async function getCurrentUser() {
    const sessionData = await getSession()
    return sessionData?.user ?? null
}

export async function deleteSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (token) {
        await db.delete(sessions).where(eq(sessions.token, token))
    }

    cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function deleteAllUserSessions(userId: string) {
    await db.delete(sessions).where(eq(sessions.userId, userId))
}
