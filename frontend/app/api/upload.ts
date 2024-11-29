import React, { ChangeEvent } from 'react';

// 핸들러: BASE_URL과 AUTH_TOKEN 반환
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const BASE_URL = process.env.BASE_URL || "http://0.0.0.0:8000";
  const AUTH_TOKEN = process.env.AUTH_TOKEN || "your-hardcoded-token";

  const responsePayload = {
    BASE_URL,
    AUTH_TOKEN,
  };

  res.status(200).json(responsePayload);
}

export async function uploadFile(file: File): Promise<string> {
  const tokenResponse = await fetch('/api/env');
  if (!tokenResponse.ok) {
    throw new Error('Failed to retrieve environment variables from server.');
  }

  const { BASE_URL, AUTH_TOKEN } = await tokenResponse.json();

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