import { Head } from "$fresh/runtime.ts";
import ChevronPattern from "../components/chevron.tsx";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="px-4 py-8 pt-[200px] mx-auto bg-[#D23B49]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <p class="my-4">
            The page you were looking for doesn't exist.
          </p>
          <a href="/" class="underline">Go back home</a>
        </div>
      </div>
      <ChevronPattern />
      <div className={"h-56"}></div>
    </>
  );
}
