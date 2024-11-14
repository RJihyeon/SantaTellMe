import { Button } from "../components/Button.tsx";
import ChevronPattern from "../components/chevron.tsx";
import JokeComponent from "../components/joke.tsx";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <div className="bg-[#D23B49] w-full pt-[200px] relative">
        <div className="w-full lg:w-[70%] max-w-[1300px] mx-auto ">
          <div>
            <img
              src="/santa.png"
              width="128"
              height="128"
              alt="the Fresh logo: a sliced lemon dripping with juice"
              className={"my-6 mx-auto"}
            />
            <h2 class="text-7xl m-6 text-white">Santa Tell Me</h2>
            <hr
              className={
                "w-56 h-1 mx-auto my-4 bg-slate-200 border-0 rounded md:my-10 "
              }
            />
            <JokeComponent />
          </div>
        </div>
        <div class="absolute w-full">
          <ChevronPattern forecolor="#D23B49" />
        </div>
      </div>
      <div className={"my-[200px] flex flex-row gap-2"}>
        <Button>시작하기!</Button>
        <Button>로그아웃</Button>
      </div>
    </div>
  );
}
