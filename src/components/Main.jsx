import React, { useContext, useEffect, useRef } from 'react'
import './Main.css'
import { assets } from '../assets/assets'
import { Context } from '../context/Context'

const Main = () => {

    const msgEnd = useRef(null);
    const resultContainerRef = useRef(null);

    const {onSent,showResult,loading,resultMessage,resultEnd,setInput,input,messages, isAtBottom, setIsAtBottom} = useContext(Context)

    const autoResizeTextarea = (e) => {
        const textarea = e.target;
        textarea.style.height = "30px"; // Reset height
        textarea.style.height = textarea.scrollHeight + "px"; // Set to scrollHeight
    };

    useEffect(() => {
        renderMarkdown(); // Refreshes the markdown format

        // If the user has NOT scrolled up, auto-scroll
        if (resultContainerRef.current && isAtBottom) {
            resultContainerRef.current.scrollTop = resultContainerRef.current.scrollHeight
            // msgEnd.current?.scrollIntoView(); // MAIN LINE FOR SCROLLING ENTIRE WEBPAGE
        }
    }, [messages, resultMessage]);

    // Detects user scroll position
    const handleScroll = () => {
        if (!resultContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = resultContainerRef.current;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 30);
    };

    const enterPressed = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevents newline from being inserted
            await sendMessage();
            setIsAtBottom(true);
        }
    };

    const sendMessage = async () => {
        if (!loading && resultMessage === resultEnd) {
            await onSent();
            setIsAtBottom(true);
        }
    }

    // Function to handle card clicks
    const handleCardClick = async (text) => {
        await onSent(text);  // Trigger the submission
        setIsAtBottom(true);
    }

    return (
        <div className='main'>
            <div className="main-container">
                {!showResult
                ?
                <>
                    <div className="greet">
                        <p><span>Hello, Welcome to NAIMUN AI.</span></p>
                        <p>Please pick a conference type.</p>
                    </div>
                    <div className="cards">
                        <div className="cardeuro" onClick={(e) => handleCardClick("European Commission")}>
                            <p>European Commission</p>
                            <img src={assets.NAIMUN_icon} alt="" />
                        </div>
                        <div className="card-ccpcj" onClick={(e) => handleCardClick("Interpol (Double-Delegation)")}>
                            <p>Interpol (Double-Delegation)</p>
                            <img src={assets.NAIMUN_icon} alt="" />
                        </div>
                    </div>
                    <p className="disclaimer">
                    This is an experimental project done by students of the Oxford Team. In no way should you rely solely on the AI for research and Rules of Procedure. If you run into issues, please refer to official documents.
                    </p>
                </>
                :
                <>
                    <div className='result' ref={resultContainerRef} onScroll={handleScroll}>
                        {messages.map((message, i) =>
                            <div key={i} className={!message.isBot?"result-user":"result-message"}>
                                <img src={!message.isBot?assets.user_icon:assets.NAIMUN_icon} alt='' />
                                {message.isBot?
                                    <github-md dangerouslySetInnerHTML={{ __html: i === messages.length - 1 ? resultMessage : message.text }}></github-md>
                                    :
                                    <github-md>{message.text}</github-md>
                                }
                            </div>
                        )}
                        <div ref={msgEnd}/>
                    </div>
                    <div className="main-bottom">
                        <div className="search-box">
                            <textarea
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    autoResizeTextarea(e);
                                }}
                                onKeyDown={enterPressed}
                                placeholder="Enter a prompt here"
                            />
                            <div>
                                <img src={assets.gallery_icon} alt="" />
                                <img src={assets.mic_icon} alt="" />
                                <img onClick={()=>sendMessage()} src={assets.send_icon} alt="" />
                            </div>
                        </div>
                        <p className='bottom-info'>
                        NAIMUN AI might display inaccurate info so double check its response and please refer to official documents.
                        </p>
                    </div>
                </>
                }

                

                

            </div>
        </div>
    )
}

export default Main