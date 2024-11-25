import { JSX } from "preact";

export default function Profile() {
  return (
    <div
      className={
        "flex flex-row flex-wrap gap-2 bg-red-400 rounded-lg md:w-full mx-auto p-2"
      }
    >
      <div className={"md:w-1/5 h-full"}>
        <img
          src="https://via.placeholder.com/150"
          alt="Avatar"
          className={"rounded-l-lg"}
        />
      </div>
      <div className={"md:w-3/5 h-full"}>
        <div
          className={
            "flex flex-col bg-slate-50 rounded-r-lg place-content-between h-[150px]"
          }
        >
          <div>
            <strong>Name:</strong> John Doe
          </div>
          <div>
            <strong>Nickname:</strong> Johnny
          </div>
          <div>
            <strong>Email:</strong> johndoe@example.com
          </div>
          <hr />
          <div className={"flex flex-row gap-2 my-2"}>
            <div>
              <a href="https://kakao.com/johndoe">
                <span>Kakao Profile</span>
              </a>
            </div>
            <div>
              <span>Total guesses: 0</span>
            </div>
            <div>
              <span>Correct %: 100%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={"md:w-1/5 h-full"}>
        <button>Edit Profile</button>
      </div>
    </div>
  );
}
