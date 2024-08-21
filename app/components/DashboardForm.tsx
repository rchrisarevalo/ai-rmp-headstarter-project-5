import React, { useState, useEffect } from "react";
import { ChatMessage } from "../types/types.config";

interface DashboardFormProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const DashboardForm: React.FC<DashboardFormProps> = ({
  chatMessages,
  setChatMessages,
}) => {
  const [userMessage, setUserMessage] = useState<string>("");

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent automatic submissions.
    e.preventDefault();

    // Clear current message from text input box.
    setUserMessage("");

    // Update the chatMessages array state variable to store
    // the messages from the user typing in their response.
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
  };

  return (
    <div className="flex flex-row gap-10 w-full items-center rounded-lg">
      <form
        onSubmit={handleSubmission}
        className="w-full flex flex-row max-sm:flex-col gap-10 justify-between"
      >
        <textarea
          cols={50}
          rows={1}
          placeholder="Enter your response here"
          className="p-4 flex items-center rounded-lg outline-none border-transparent resize-none"
          onChange={(e) => setUserMessage(e.target.value)}
          value={userMessage}
          required
        ></textarea>
        <button
          type="submit"
          className="p-5 pl-10 pr-10 rounded-lg bg-slate-500 transition ease-in-out hover:bg-black text-white font-extrabold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DashboardForm;
