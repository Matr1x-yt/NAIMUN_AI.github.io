import { createContext, useState } from "react";
import runChat from "../config/naimun";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultMessage,setResultMessage] = useState("");
    const [resultEnd, setResultEnd] = useState("");
    const [messages,setMessages] = useState([]);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultMessage(prev=>prev+nextWord);
        },50*index)
    };

    const onSent = async (inputText = input) => {
        if (!inputText) return; // Prevent sending blank input
        setResultMessage("Loading..")
        setResultEnd("")
        setShowResult(true)
        setInput("")
        setMessages([
            ...messages,
            {text: inputText, isBot: false},
            {text: " ", isBot: true}
        ]);
        setLoading(true)

        const response = await runChat(inputText)
        setResultMessage("") // Gets rid of the loader.
        let newResponseArray = response.split(" ").filter(word => word.trim() !== "");;
        for(let i=0; i<newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+" ")
            setResultEnd(result=>result+nextWord+" ")
        }
        setMessages([
            ...messages,
            {text: inputText, isBot: false},
            {text: response, isBot: true}
        ]);

        setLoading(false);
    }

    const contextValue = {
        onSent,
        showResult,
        loading,
        resultMessage,
        resultEnd,
        input,
        setInput,
        messages,
        isAtBottom,
        setIsAtBottom
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider