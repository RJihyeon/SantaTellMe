import { JSX } from "preact";

// Jokes courtesy of https://punsandoneliners.com/randomness/programmer-jokes/
const JOKES = [
  "Ho Ho Ho!",
  "Serving fun since Christmas holidays",
  "Santa was here.",
  "Many know me from Lapland, but not from the motherland!",
  "Why does Santa go down the chimney on Christmas Eve? Because it soot-s him!",
  "What do you call a kid who doesn’t believe in Santa? A rebel without a Claus.",
  "How much did Santa pay for his sleigh? Nothing, it was on the house!",
  "What do you get if you cross Santa with a duck? A Christmas quacker!",
  "Why is Santa so good at karate? Because he has a black belt in 'ho-ho-ho!'"
];

const JokeComponent = () => {
  const randomIndex = Math.floor(Math.random() * JOKES.length);
  
  
  return (
    <div className={"mt-4 mb-12"}>
      <p className={"text-slate-200 font-bold italic"}>{JOKES[randomIndex]}</p>
    </div>
  );
};

export default JokeComponent;