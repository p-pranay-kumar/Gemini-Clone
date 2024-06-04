import { createContext, useState } from "react";
import run from "../config/gemini";

export const context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [isNewChat, setIsNewChat] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const onSent = async (prompt) => {
        setLoading(true);
        setResultData(""); // Clear the previous result data
        setResult(true); // Show the result section

        try {
            const result = await run(prompt);
            let responseArray = result.split("**");
            let newResponse = ""; // Initialize newResponse as an empty string

            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 === 0) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
            setLoading(false);
            setRecentPrompt(prompt);
            // Only add the prompt to prevPrompts if it doesn't already exist
            if (!prevPrompts.includes(prompt)) {
                setPrevPrompts([...prevPrompts, prompt]);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error sending prompt:", error);
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        setLoading,
        resultData,
        input,
        setInput,
        setResultData,
        isNewChat,
        setIsNewChat,
    };

    return (
        <context.Provider value={contextValue}>
            {props.children}
        </context.Provider>
    );
};

export default ContextProvider;
