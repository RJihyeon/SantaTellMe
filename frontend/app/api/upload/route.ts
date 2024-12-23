import { NextRequest, NextResponse } from "next/server";
import { getJwt } from "@/app/lib/auth_jwt";

export async function POST(req: NextRequest) {
  const { token, user, error } = getJwt(req);
  if (error) NextResponse.json({ user: null });

  try {
    // Get user_id of receiver
    const receiverToken = req.nextUrl.searchParams.get('token') || undefined;
    const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/invitation/user?token=${receiverToken}`,
        {
          method: "GET",
        //   body: newFormData,
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for double verification
            // Do NOT manually set Content-Type here. Let fetch handle it.
          },
        }
    );

    if (!userResponse.ok) {
        const errorData = await userResponse.json();
        return NextResponse.json(
            { message: `Failed to fetch user ID: ${errorData.message}` },
            { status: userResponse.status }
        );
    }

    const { user_id } = await userResponse.json();

    console.log("Reciever: " + receiverToken);
    console.log("User id is: " + user_id);

    // Extract FormData from the request
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert Blob to File to ensure proper handling
    const fileToSend = new File([file], "upload", { type: file.type });

    const newFormData = new FormData();
    newFormData.append("audio_file", fileToSend);

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice?to_user_id=${user_id}`,
      {
        method: "POST",
        body: newFormData,
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for double verification
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
