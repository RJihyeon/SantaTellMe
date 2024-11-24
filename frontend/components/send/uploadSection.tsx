import { Handlers, PageProps } from "$fresh/server.ts";
import UploadResult from "../../islands/uploadResult.tsx";
import Upload from "./upload.tsx";

export default function SectionUpload() {
  return (
    <section>
      <div
        className={
          "wrapper items-center justify-center bg-slate-400 rounded-lg h-40 over"
        }
      >
        <div className={"w-full h-40 px-4 my-4"}>
          <div className={"px-2 my-2 flex flex-col gap-2 items-center"}>
            <h2 className={"hidden"}>Send</h2>
            <h3>Send a file</h3>
            <Upload message={"Upload a text file"} />
          </div>
        </div>
        <div className={"w-2 h-full bg-slate-600"}>
        </div>
        <div class="w-full h-40">
          <div className={"px-2 my-2 flex flex-col gap-2 items-center"}>
            <h2 className={"hidden"}>Result</h2>
            <h3>Awaiting upload...</h3>
            <UploadResult />
          </div>
        </div>
      </div>
    </section>
  );
}
