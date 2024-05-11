import { createContext, useState } from "react";
import runChat from "../Config/Gemini";
export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const delayPara = (index, nextword) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response += await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response += await runChat(input);
    }

    let responseArray = response.split("**");
    let newresponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newresponse += responseArray[i];
      } else {
        newresponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newresponse.split("*").join("<br />");
    const newResponseArray = newResponse2.split(" ");
    {
      for (let i = 0; i < newResponseArray.length; i++) {
        const newWord = newResponseArray[i];
        delayPara(i, newWord + " ");
      }
    }

    setLoading(false);
    setInput("");
  };

  const contextValues = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValues}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
