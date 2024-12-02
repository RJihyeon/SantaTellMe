import dotenv from 'dotenv';

dotenv.config();

export async function uploadFile(file: File): Promise<string> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  console.log('BASE_URL:', BASE_URL);
  console.log('AUTH_TOKEN:', AUTH_TOKEN);

  if (!BASE_URL || !AUTH_TOKEN) {
    throw new Error('BASE_URL or AUTH_TOKEN is not defined in the environment variables.');
  }

  const formData = new FormData();
  formData.append('audio_file', file);

  const toUserId = 1; // Temporary user ID
  const url = `${BASE_URL}/voice?to_user_id=${toUserId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: HTTP ${response.status}, ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload result:', result);
    return result.message || 'File uploaded successfully!';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during upload.');
  }
}