import { Handlers, PageProps } from "$fresh/server.ts";
import UploadResult from "../../islands/uploadResult.tsx";
import Upload from "./upload.tsx";

export default function SectionUpload() {
  return (
    <section>
      <div
       className="flex items-center justify-center h-80 flex-col md:flex-row"
      >
        <div className={"w-full h-full px-4 my-4 bg-slate-400 rounded-l-lg"}>
          <div className={"px-2 my-2 flex flex-col gap-2 items-center"}>
            <h2 className={"hidden"}>Send</h2>
            <h3>Send a file</h3>
            <Upload message={"Upload a text file"} />
          </div>
        </div>
        <div className={"w-2 h-full bg-slate-600 hidden md:block"}>
        </div>
        <div class="w-full h-full bg-red-200 rounded-r-lg">
          <div className={"px-2 my-2 flex flex-col gap-2 items-center"}>
            <h2 className={"hidden"}>Result</h2>
            <UploadResult />
          </div>
        </div>
      </div>
    </section>
  );
}
