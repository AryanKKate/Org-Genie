import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  const delayPara = (index, nextWord, callback) => {
    setTimeout(() => {
      callback((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    const newChatInstance = {
      id: Date.now(),
      history: [],
      resultData: "",
    };
    setChats((prev) => [...prev, newChatInstance]);
    setCurrentChatId(newChatInstance.id);
    setPrevPrompts([]);
    setLoading(false);
    setInput("");
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setPrevPrompts(chat.history.map((entry) => entry.prompt));
    }
  };

  const onSent = async (prompt) => {
    console.log("onSent called with prompt:", prompt);
    if (!currentChatId) {
      console.log("No currentChatId, creating new chat");
      newChat();
    }

    const currentPrompt = prompt !== undefined ? prompt : input;
    if (!currentPrompt.trim()) return;

    setLoading(true);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              history: [
                ...chat.history,
                { prompt: currentPrompt, timestamp: new Date().toLocaleString() },
              ],
            }
          : chat
      )
    );
    setPrevPrompts((prev) => [...prev, currentPrompt]);

    try {
      const response = await run(currentPrompt);
      // ... rest of your response processing logic ...
    } catch (error) {
      console.error("Error processing query:", error);
      // ... error handling ...
    }

    setLoading(false);
    setInput(""); // Clear input after submission
  };

  const contextValue = {
    input,
    setInput,
    chats,
    currentChatId,
    prevPrompts,
    setPrevPrompts,
    loading,
    onSent,
    newChat,
    switchChat,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;