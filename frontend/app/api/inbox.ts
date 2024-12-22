import dotenv from "dotenv";
dotenv.config();

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
  console.log("fetchVoiceInbox: Function called");

  try {
    console.log("Fetching voice inbox from API...");
    console.log(
      "API URL:",
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/voices`
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/voices`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
      }
    );

    console.log("Fetch Response Status:", response.status);

    if (!response.ok) {
      console.error("API request failed:", response);
      throw new Error("Failed to fetch voice inbox");
    }

    // Step 3: API 응답 데이터 읽기
    const data = await response.json();
    console.log("Fetched Data from API:", data);

    const { received, sent } = data;

    // Step 4: 받은 음성 메타데이터 처리
    console.log("Processing received voices...");
    const receivedVoices = await Promise.all(
      received.map(async (voiceMeta: any) => {
        console.log("Received Voice Meta:", voiceMeta);
        return {
          id: voiceMeta.id,
          sender: voiceMeta.from_user,
          receiver: voiceMeta.to_user,
          receiveTime: voiceMeta.created_at,
          guessed: voiceMeta.is_correct ?? false,
        };
      })
    );

    // Step 5: 보낸 음성 메타데이터 처리
    console.log("Processing sent voices...");
    const sentVoices = await Promise.all(
      sent.map(async (voiceMeta: any) => {
        console.log("Sent Voice Meta:", voiceMeta);
        return {
          id: voiceMeta.id,
          sender: voiceMeta.from_user,
          receiver: voiceMeta.to_user,
          receiveTime: voiceMeta.created_at,
          guessed: voiceMeta.is_correct ?? false,
        };
      })
    );

    console.log("Processed Voices - Received:", receivedVoices);
    console.log("Processed Voices - Sent:", sentVoices);

    // Step 6: 반환
    return { receivedVoices, sentVoices };
  } catch (error) {
    console.error("Error fetching voice inbox:", error);
    return { receivedVoices: [], sentVoices: [] };
  }
};
