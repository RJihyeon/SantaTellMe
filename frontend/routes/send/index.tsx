import { useSignal } from "@preact/signals";
import { render } from "preact";
import { useEffect } from "preact/hooks";
import { Button } from "../../components/Button.tsx";

export default function Home() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ fontFamily: "'Mountains of Christmas', serif", fontWeight: "700", fontStyle: "normal"}} class="mx-auto flex flex-row items-center justify-center gap-2 mt-[200px]">
      <div class="bg-slate-300 w-screen h-screen">
        <div>
            <h1>Send</h1>
        </div>
      </div>
      <div class="bg-red-300 w-screen h-screen">
        <h1>Result</h1>
      </div>
    </div>
  );
}
