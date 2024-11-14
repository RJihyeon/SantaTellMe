import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold" 
    />
  );
}
