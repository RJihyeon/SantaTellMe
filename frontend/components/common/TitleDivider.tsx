import { JSX } from "preact";

interface TitleDividerProps {
  title: string;
}

export default function TitleDivider({ title }: TitleDividerProps) {
  return (
    <section className={"mt-12"}>
      <div className={"wrapper"}>
        <h2>{title}</h2>
      </div>
      <hr className={"border-1 bg-black mb-4"} />
    </section>
  );
}
