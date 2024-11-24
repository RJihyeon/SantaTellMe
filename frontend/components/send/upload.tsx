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
      <form method="post" encType="multipart/form-data">
        <input type="file" name="my-file" />
        <button type="submit">Upload</button>
      </form>
      {message ? <p>{message}</p> : null}
    </>
  );
}