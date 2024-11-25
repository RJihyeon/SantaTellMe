import { useEffect } from "preact/hooks";
import Upload from "../../islands/upload.tsx";
import SectionUpload from "../../components/send/SectionUpload.tsx";
import ChevronBg from "../../components/chevronBg.tsx";
import TitleDivider from "../../components/common/TitleDivider.tsx";
import SectionSendTo from "../../components/send/SectionSend.tsx";
import SectionWaitingRoom from "../../components/send/SectionWaitingRoom.tsx";

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
      <TitleDivider title="Step 1: Create an encoded message!" />
      <SectionUpload />
      <TitleDivider title="Step 2: Select recipient" />
      <SectionSendTo />
      <TitleDivider title="Step 3: Await a response~" />
      <SectionWaitingRoom />
    </>
  );
}
