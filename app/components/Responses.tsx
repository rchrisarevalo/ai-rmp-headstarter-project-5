import React from "react";
import Markdown from "react-markdown";

// Properties that will be used for the
// custom components below.
interface ResProps {
  message: string;
}

// Components for user response (the person typing into the input box)
// and the bot response (the generative AI's response(s)).
// ===================================================================
const UserRes: React.FC<ResProps> = ({ message }) => {
  return (
    <div className="w-full flex flex-row justify-end text-white">
      <div className="bg-blue-600 p-10 w-1/2 max-sm:w-4/5 rounded-lg">
        {message}
      </div>
    </div>
  );
};

const BotRes: React.FC<ResProps> = ({ message }) => {
  return (
    <div className="w-full flex flex-row justify-start text-black">
      <div className="bg-slate-300 p-10 w-1/2 max-sm:w-4/5 rounded-lg">
        <Markdown>
          {message}
        </Markdown>
      </div>
    </div>
  );
};
// ===================================================================

export { UserRes, BotRes };
