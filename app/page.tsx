"use client";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import DashboardForm from "./components/DashboardForm";
import { UserRes, BotRes } from "./components/Responses";
import { ChatMessage } from "./types/types.config";
import "@fontsource/source-sans-pro";
import Nav from "./components/Nav";
import { IoIosBookmarks } from "react-icons/io";
import ParticleBackground from "./components/ParticleBackground";

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi there! My name is **AI Rate My Professor**, and I will be your assistant today! How can I help you out in this fine day?",
    },
  ]);

  return (
    <>
      <ParticleBackground />
      <main
        style={{
          position: 'relative', // Ensure positioning for z-index to work
          zIndex: 1,
        }}
        className="flex min-h-screen flex-col items-center justify-evenly p-24 bg-transparent text-black"
      >
        {/* <Nav /> */}
        <h1 className="text-black items-center justify-center font-['Source_Sans_Pro'] flex flex-row gap-x-2 text-4xl font-bold">
          <p className="text-red">
            <IoIosBookmarks color='red' />
          </p>
          AI Rate My Professor
        </h1>
        <div className="shadow-xl flex flex-col font-['Source_Sans_Pro'] w-[60%] mt-16 text-lg items-center max-sm:w-screen justify-evenly p-12 rounded-lg bg-slate-300 gap-12">
          <Dashboard>
            {chatMessages.map((message) =>
              message.role === "assistant" ? (
                <BotRes key={message.content} message={message.content} />
              ) : (
                <UserRes key={message.content} message={message.content} />
              )
            )}
          </Dashboard>
          <DashboardForm
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        </div>
      </main>
    </>
  );
}