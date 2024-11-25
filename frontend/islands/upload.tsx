import { useState } from "preact/hooks";
import { uploadFile } from "../api/upload.tsx";


interface UploadProps {
  initialMessage?: string;
}

export default function Upload({ initialMessage }: UploadProps) {
  const [message, setMessage] = useState(initialMessage || "");
  async function handleFormSubmit(event: Event) {
    event.preventDefault(); // 기본 form 동작 방지

    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem("my-file") as HTMLInputElement;
    console.log("Input element:", input); // input 요소가 제대로 가져와졌는지 확인
    const file = input.files?.[0];
    console.log("Selected file:", file); // 선택된 파일이 제대로 가져와졌는지 확인

    if (!file) {
      setMessage("No file selected!");
      return;
    }

    try {
      const resultMessage = await uploadFile(file);
      setMessage(resultMessage);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred!");
      }
    }
  }

  return (
    <>
     <form
        method="post"
        encType="multipart/form-data"
        className={"flex flex-row gap-2 items-center"}
        onSubmit={handleFormSubmit} // 폼 제출 이벤트 핸들러 추가
      >
        <div>
          <input type="file" name="my-file" accept=".mp3"/>
        </div>
        <div>
          <button className={"bg-red-400"} type="submit">
            Upload
          </button>
        </div>
      </form>
      {message ? <p>{message}</p> : null}
    </>
  );
}
