"use client";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import DashboardForm from "./components/DashboardForm";
import { UserRes, BotRes } from "./components/Responses";
import { ChatMessage } from "./types/types.config";
import "@fontsource/source-sans-pro";
import Nav from "./components/Nav";

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi there! My name is **AI Rate My Professor**, and I will be your assistant today! How can I help you out in this fine day?",
    },
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24 bg-white text-black">
      <Nav />
      <div className="flex flex-col font-['Source_Sans_Pro'] mt-16 text-lg items-center max-sm:w-screen justify-evenly p-24 rounded-lg bg-slate-300 gap-12">
        <Dashboard>
          {chatMessages.map((message, i) =>
            <span key={`message-${i}`}>
              {message.role == "assistant" ? (
                <BotRes message={message.content} />
              ) : (
                <UserRes message={message.content} />
              )}
            </span>
          )}
        </Dashboard>
        <DashboardForm
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      </div>
    </main>
  );
}
