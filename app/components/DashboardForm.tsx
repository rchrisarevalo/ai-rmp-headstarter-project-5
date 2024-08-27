import React, { useState, useEffect } from "react";
import { ChatMessage } from "../types/types.config";
import { IoIosSend } from "react-icons/io";

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

    // Update the chatMessages array state variable to store
    // the messages from the user typing in their response.
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    // Fetch the personalized suggestions from the RAG implementation
    // using Pinecone and from the OpenAI API.
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...chatMessages,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: '' }
        ]),
      });

      if (res.ok) {
        const data: ChatMessage = await res.json()
        setChatMessages((prev) => [
          ...prev,
          data
        ])

        // Clear message from prompt.
        setUserMessage("");
      } else {
        console.error("Failed to retrieve personalized suggestions.");
      }
    } catch {
      throw new Error("Failed to retrieve personalized suggestions.");
    }
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
          className="p-4 flex w-full items-center rounded-lg outline-none border-transparent resize-none"
          onChange={(e) => setUserMessage(e.target.value)}
          value={userMessage}
          required
        ></textarea>
        <button
          type="submit"
          className="p-5 flex flex-row gap-x-1 items-center justify-center pl-10 pr-10 rounded-lg bg-slate-500 transition ease-in-out hover:bg-black text-white font-extrabold"
        >
          Submit
          <p className="text-3xl"><IoIosSend /></p>
        </button>
      </form>
    </div>
  );
};

export default DashboardForm;
