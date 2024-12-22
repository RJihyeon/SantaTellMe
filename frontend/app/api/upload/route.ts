import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    // Extract HttpOnly cookie (JWT)
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Decode the JWT to extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { user_id: string };

        // Extract FormData from the request
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        // Convert Blob to File to ensure proper handling
        const fileToSend = new File([file], "upload", { type: file.type });

        const newFormData = new FormData();
        newFormData.append("audio_file", fileToSend);

        // Forward the request to the backend
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice?to_user_id=${decoded.user_id}`,
            {
                method: "POST",
                body: newFormData,
                headers: {
                    Authorization: `Bearer ${token}`,  // Attach token for double verification
                    // Do NOT manually set Content-Type here. Let fetch handle it.
                },
            }
        );

        const data = await backendResponse.json();

        if (backendResponse.ok) {
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json(data, { status: backendResponse.status });
        }
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}