import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Get user_id of receiver
        const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
            {
                method: "GET",
            }
        );

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            return NextResponse.json(
                { message: `Failed to fetch user ID: ${errorData.message}` },
                { status: userResponse.status }
            );
        }

        const { kakao_auth_url } = await userResponse.json();

        return NextResponse.json(
            { kakao_auth_url }
        )
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
