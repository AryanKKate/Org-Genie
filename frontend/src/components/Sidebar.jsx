import React, { useContext, useState } from "react"
import { IoMenu } from "react-icons/io5"
import { FaMessage, FaPlus, FaQuestion } from "react-icons/fa6"
import { MdHistory } from "react-icons/md"
import { IoSettings } from "react-icons/io5"
import { Context } from "../context/Context"
import './Sidebar.css'

const Sidebar = () => {
  const [extended, setExtended] = useState(false)
  const { onSent, prevPrompt, setRecentPrompt, newChat } = useContext(Context)

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)

    await onSent(prompt)
  }

  return (
    <div className="sidebar min-h-screen inline-flex flex-col justify-between bg-[#e4e7eb] py-[25px] px-[15px]">
      <div>
        <IoMenu 
          onClick={() => setExtended(!extended)}
          className="text-3xl block cursor-pointer text-white"
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
            <p className="mt-7 mb-5  text-white">Recent</p>

            {prevPrompt?.map((item, index) => {
              return (
                <div
                  onClick={() => loadPrompt(item)}
                  className="flex items-center gap-2 p-2 pr-10 rounded-[50px] text-slate-700 cursor-pointer hover:bg-gray-300"
                >
                  <FaMessage className="text-2xl" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      
    </div>
  )
}

export default Sidebar
