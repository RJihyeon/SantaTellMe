import { Handlers } from "$fresh/server.ts";

interface UploadProps {
  message: string | null;
}

export const handler: Handlers<UploadProps> = {
  async GET(req, ctx) {
    return await ctx.render({
      message: null,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const file = form.get("my-file") as File;

    if (!file) {
      return ctx.render({
        message: `Please try again`,
      });
    }

    const name = file.name;
    const contents = await file.text();

    console.log(contents);

    return ctx.render({
      message: `${name} uploaded!`,
    });
  },
};

export default function Upload(props: UploadProps) {
  const message = props.message;
  return (
    <>
      <form method="post" encType="multipart/form-data" className={"flex flex-row gap-2 items-center"}>
        <div>
          <input type="file" name="my-file" />
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
