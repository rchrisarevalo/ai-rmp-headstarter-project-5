import React from "react";
import '@fontsource/source-sans-pro'

const Nav = () => {
    return (
        <nav className="flex flex-row fixed top-0 p-6 items-center justify-between gap-10 w-screen bg-slate-300">
            <ul>
                <h1 className="text-black font-['Source_Sans_Pro'] text-2xl font-bold">RMP Clone</h1>
            </ul>
            <ul className="flex flex-row items-center justify-between text-lg">
                <li className="p-4 font-['Source_Sans_Pro'] font-extrabold">Home</li>
                <li className="p-4 font-['Source_Sans_Pro'] font-extrabold">Chat</li>
            </ul>
        </nav>
    )
}

export default Nav;