import { useEffect } from "preact/hooks";
import Upload from "../../components/send/upload.tsx";
import SectionUpload from "../../components/send/uploadSection.tsx";
import ChevronBg from "../../components/chevronBg.tsx";

export default function Home() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <ChevronBg />
      <SectionUpload />
    </>
  );
}
