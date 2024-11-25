// src/Header.js
import { JSX } from "preact";
import ChevronPattern from "./chevron.tsx";

const Header = () => {
  return (
    <header>
      <div
        className={
          "w-full mx-auto text-white relative"
        }
      >
        <div className={"bg-slate-800"}>
          <div className="w-full lg:w-[70%] max-w-[1300px] flex flex-row justify-between mx-auto">
            <div className={"m-4"}>
              <h2>Santa Tell Me</h2>
            </div>
            <div className={"m-4"}>
              <ul style={styles.navList} className={"h-full flex flex-row gap-2 lg:gap-6 items-center"}>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/send">Send</a>
                </li>
                <li>
                  <a href="/my">Profile</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={"absolute w-full z-30"}>
          <ChevronPattern forecolor="#282c34" />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#282c34",
    color: "white",
    textAlign: "center",
  },
  navList: {
    listStyleType: "none",
    padding: 0,
  },
};

export default Header;
