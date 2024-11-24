import { Handlers, PageProps } from "$fresh/server.ts";

export default function SectionUpload() {
  return (
    <section>
      <div
        className={
          "wrapper items-center justify-center h-80"
        }
      >
        <div className={"w-full h-full px-4 my-4"}>
            <a href={"/my"}>Go to my profile</a>
        </div>
      </div>
    </section>
  );
}
