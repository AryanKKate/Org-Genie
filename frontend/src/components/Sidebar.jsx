import React, { useContext, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaMessage, FaPlus } from "react-icons/fa6";
import { Context } from "../context/Context";
import './Sidebar.css';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { chats, newChat, switchChat, currentChatId } = useContext(Context);

  return (
    <div className="sidebar min-h-screen inline-flex flex-col justify-between bg-[#e4e7eb] py-[25px] px-[15px]">
      <div>
        <IoMenu
          onClick={() => setExtended(!extended)}
          className="text-3xl block cursor-pointer text-white mx-1.5"
        />

        <div
          onClick={() => newChat()}
          className="mt-[30px] inline-flex items-center gap-[10px] py-[10px] px-[10px] text-[18px] text-black cursor-pointer bg-blue-300 rounded-full"
        >
          <FaPlus className="text-s" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="flex flex-col animate-fadeIn duration-1000">
            <p className="mt-7 mb-5 pl-2 text-white">Chat History</p>
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={`flex items-center gap-2 p-2 pr-10 rounded-[50px] text-slate-700 cursor-pointer hover:bg-gray-300 ${
                  chat.id === currentChatId ? "bg-gray-300" : ""
                }`}
              >
                <FaMessage className="text-2xl" />
                <p>
                  {chat.history.length > 0
                    ? chat.history[0].prompt.slice(0, 18) + "..."
                    : "New Chat"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;