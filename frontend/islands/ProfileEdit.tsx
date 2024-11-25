// src/components/EditProfileForm.tsx
import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

const ProfileEdit: FunctionalComponent = () => {
  const [nickname, setNickname] = useState("");
  const [visibility, setVisibility] = useState("public");

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    console.log("Nickname:", nickname);
    console.log("Visibility:", visibility);
    // Handle form submission logic here
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-200 p-4 rounded-lg w-full"
      >
        <div className="mb-4">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="visibility">
            Visibility:
          </label>
          <select
            id="visibility"
            name="visibility"
            value={visibility}
            onChange={(e) =>
              setVisibility((e.target as HTMLSelectElement).value)
            }
            required
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
        <div className={"w-full"}>
          <div className={"mx-auto"}>
            <button className={"bg-red-400"} type="submit">Save Changes</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
