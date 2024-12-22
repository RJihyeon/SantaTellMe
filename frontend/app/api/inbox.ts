import { getCookie } from "../utils/cookies";

export type VoiceData = {
  id: number;
  sender: string;
  receiver: string;
  receiveTime: string;
  guessed: boolean;
};

// 음성 사서함 데이터 가져오기 (받은 메일함과 보낸 메일함 구분)
export const fetchVoiceInbox = async (): Promise<{
  receivedVoices: VoiceData[];
  sentVoices: VoiceData[];
}> => {
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
    const { received, sent } = data;

    // 받은 음성 메타데이터 처리
    const receivedVoices = await Promise.all(
      received.map(async (voiceMeta: any) => ({
        id: voiceMeta.id,
        sender: voiceMeta.from_user,
        receiver: voiceMeta.to_user,
        receiveTime: voiceMeta.created_at,
        guessed: voiceMeta.is_correct ?? false,
      }))
    );

    // 보낸 음성 메타데이터 처리
    const sentVoices = await Promise.all(
      sent.map(async (voiceMeta: any) => ({
        id: voiceMeta.id,
        sender: voiceMeta.from_user,
        receiver: voiceMeta.to_user,
        receiveTime: voiceMeta.created_at,
        guessed: voiceMeta.is_correct ?? false,
      }))
    );

    return { receivedVoices, sentVoices };
  } catch (error) {
    console.error("Error fetching voice inbox:", error);
    return { receivedVoices: [], sentVoices: [] };
  }
};
