// pages/index.tsx

import React from "react";
import JokeComponent from "./components/joke";
import ChevronPattern from "./components/chevron";
import LoginButton from "./components/LoginButton";

const Home: React.FC = async () => {  
  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <div className="bg-[#D23B49] w-full pt-36 relative">
        <div className="wrapper">
          <div className="w-full">
            <img
              src="/santa.png"
              width="128"
              height="128"
              alt="the Fresh logo: a sliced lemon dripping with juice"
              className="my-6 mx-auto"
            />
            <h2 className="text-7xl m-6 text-white">Santa Tell Me</h2>
            <hr className="w-56 h-1 mx-auto my-4 bg-slate-200 border-0 rounded md:my-10" />
            <JokeComponent />
          </div>
        </div>
        <div className="absolute w-full">
          <ChevronPattern forecolor="#D23B49" />
        </div>
      </div>
      <div className="my-[200px] flex flex-row gap-2">
        <LoginButton />
      </div>
    </div>
  );
};

export default Home;
