import { getCookie } from "../utils/cookies";

export type VoiceData = {
  id: number;
  sender: string;
  receiveTime: string;
  guessed: boolean;
};

// 받은 음성 목록 가져오기
export const fetchVoiceInbox = async (): Promise<VoiceData[]> => {
  try {
    // 쿠키에서 JWT 토큰 읽기
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      throw new Error("No access token found in cookies");
    }

    const response = await fetch("http://0.0.0.0:8000/user/voices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // 쿠키에서 읽은 토큰 사용
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch voice inbox");
    }

    const data = await response.json();
    const receivedVoiceIds = data.received_voice_ids;

    const voices = await Promise.all(
      receivedVoiceIds.map(async (voiceId: number) => {
        const voiceMetaResponse = await fetch(
          `http://0.0.0.0:8000/voice/${voiceId}/meta`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!voiceMetaResponse.ok) {
          throw new Error(`Failed to fetch metadata for voice ID: ${voiceId}`);
        }

        const voiceMeta = await voiceMetaResponse.json();

        return {
          id: voiceMeta.id,
          sender: voiceMeta.from_user,
          receiveTime: voiceMeta.created_at,
          guessed: voiceMeta.is_correct ?? false,
        };
      })
    );

    return voices;
  } catch (error) {
    console.error("Error fetching voice inbox:", error);
    return [];
  }
};
