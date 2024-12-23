import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedUser {
    id: string;
    email: string;
}

export function verifyJwt(req: Request): { user: DecodedUser | null, error: NextResponse | null } {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
        return {
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: No token provided" },
                { status: 401 }
            ),
        };
    }

    // Extract the token from the cookie string
    const token = cookieHeader
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

    if (!token) {
        return {
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: Missing token" },
                { status: 401 }
            ),
        };
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || ""
        ) as DecodedUser;

        return { user: decoded, error: null };
    } catch (error) {
        console.error("Invalid token:", error);
        return {
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: Invalid token" },
                { status: 403 }
            ),
        };
    }
}

export function getJwt(req: Request): { token: string | null, user: DecodedUser | null, error: NextResponse | null } {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
        return {
            token: null,
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: No token provided" },
                { status: 401 }
            ),
        };
    }

    // Extract the JWT from the 'access_token' cookie
    const token = cookieHeader
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

    if (!token) {
        return {
            token: null,
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: Missing token" },
                { status: 401 }
            ),
        };
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || ""
        ) as DecodedUser;

        return { token, user: decoded, error: null };
    } catch (error) {
        console.error("Invalid token:", error);
        return {
            token: null,
            user: null,
            error: NextResponse.json(
                { message: "Unauthorized: Invalid token" },
                { status: 403 }
            ),
        };
    }
}