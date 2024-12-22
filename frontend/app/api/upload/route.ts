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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

        // Extract FormData from incoming request
        const formData = await req.formData();
        const audioFile = formData.get("audio_file") as Blob;
        const toUserId = formData.get("to_user_id") as string || 'test';

        if (!audioFile) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        // Convert Blob to File to ensure proper handling
        const fileToSend = new File([audioFile], "upload.mp3", { type: audioFile.type });

        const newFormData = new FormData();
        newFormData.append("audio_file", fileToSend);

        // Construct the backend URL with to_user_id as a query parameter
        const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice?to_user_id=${toUserId}`;

        // Forward the request to the backend
        const backendResponse = await fetch(backendUrl, {
            method: "POST",
            body: newFormData,  // Send FormData with only the audio file
            headers: {
                Authorization: `Bearer ${token}`,  // Attach token for verification
                // No Content-Type - Let fetch auto-set it
            },
        });

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