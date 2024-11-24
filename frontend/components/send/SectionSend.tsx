import { Handlers, PageProps } from "$fresh/server.ts";
import DropDownList from "../../islands/DropdownListForm.tsx";

export default function SectionSendTo() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]; // 유저 리스트 받기

  return (
    <section>
      <div className={"wrapper"}>
        <div className={"h-72 bg-red-200 rounded-lg p-4 mx-auto"}>
          <h3>Send to:</h3>
          <DropDownList onSubmit={(selection) => {}} />
        </div>
      </div>
    </section>
  );
}
