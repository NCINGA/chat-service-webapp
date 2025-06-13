import React, {ChangeEvent, FC, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Button} from "primereact/button";
import {MessageCircle, Send, ThumbsDown, ThumbsUp, User, Users} from "react-feather";
import "../App.css";
import {useMutation, useSubscription} from "@apollo/client";
import {CHAT_SEND_MESSAGE, CHAT_SUBSCRIPTION} from "../graphql/queries";
import {IMessage, LIST, PROBLEM, TEXT, YES_NO} from "../data/data";
import {InputText} from "primereact/inputtext";
import {Avatar} from "primereact/avatar";
import {v4 as uuidv4} from 'uuid';
import {Chip} from "primereact/chip";
import "primeicons/primeicons.css";

const sessionId = uuidv4();
const ChatView: FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState<IMessage | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [typing, setTyping] = useState<boolean>(false);
    const [sendGreet, setSendGreet] = useState<boolean>(false);
    const {data: chat} = useSubscription(CHAT_SUBSCRIPTION, {
        variables: {message: {session: sessionId, user: "Me", message: "", inputType: TEXT, timestamp: 0}},
        shouldResubscribe: false
    });
    const [incomingMessage, setIncomingMessage] = useState<IMessage[]>([]);
    ;

    const [sendMessageToServer] = useMutation(CHAT_SEND_MESSAGE);

    useEffect(() => {
        if (chat && chat.subscription) {
            const incomingMessage = chat.subscription;
            if (incomingMessage) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        session: sessionId,
                        user: incomingMessage.user,
                        message: incomingMessage.message,
                        inputType: incomingMessage.inputType,
                        timestamp: incomingMessage.timestamp,
                        args: incomingMessage.args
                    }
                ]);
                setTyping(false);
            }
            setIncomingMessage((prevMessages) => [
                ...prevMessages,
                {
                    session: sessionId,
                    user: incomingMessage.user,
                    message: incomingMessage.message,
                    inputType: incomingMessage.inputType,
                    timestamp: incomingMessage.timestamp,
                    args: incomingMessage.args
                }
            ]);
        }
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = async () => {
        if (message !== null && message.message.trim()) {
            setTyping(true); // Start typing indicator
            const tempMessage = message;
            setMessage(null);

            try {
                await sendMessageToServer({
                    variables: {
                        message: {
                            session: sessionId,
                            user: "Me",
                            message: tempMessage.message,
                            inputType: TEXT,
                            timestamp: new Date().getTime(),
                            args: null
                        }
                    },
                });

                setMessages((prevMessages) => [...prevMessages, tempMessage]);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };


    const handleClick = async (value: string) => {
        try {
            await sendMessageToServer({
                variables: {
                    message: {
                        session: sessionId,
                        user: "Me",
                        message: value,
                        inputType: TEXT,
                        timestamp: new Date().getTime()
                    }
                },
            });
            console.log("send")
            setMessage(null);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await sendMessage();
        }
    };

    const inputMessage = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        setMessage({
            session: sessionId,
            user: "Me",
            message: e.target.value,
            inputType: type,
            timestamp: Date.now(),
            args: null
        });
    };

    return (
        <React.Fragment>
            <div className="animated-chat-container">
                {/* Ripple Effects */}
                <div className="ripple-effect"></div>
                <div className="ripple-effect-2"></div>

                {/* Chat Tooltip */}
                <div className="chat-tooltip">
                    💬 Chat with us!
                </div>

                {/* Main Button */}
                <Button
                    className="floating-btn"
                    icon={<MessageCircle className="message-icon"/>}
                    rounded
                    aria-label="Open Chat"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!sendGreet) {
                            handleClick("hi");
                        }
                        setSendGreet(true);
                    }}
                />

                {/* Notification Dot */}
                <div className="notification-dot"></div>
            </div>

            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 50}}
                    transition={{duration: 0.3}}
                    className="chat-window"
                >
                    <div className="chat-card">
                        <div className={"chat-box-header"} onClick={() => setIsOpen(!isOpen)}>
                            <h4>NCINGA HelpDesk</h4>
                        </div>
                        <div className="chat-body">
                        <div className="messages">
                                {[...messages]
                                    .sort((a, b) => a.timestamp - b.timestamp)
                                    .map((msg, index) => (
                                        <div key={index}>
                                            <div style={{
                                                padding: 5,
                                                display: "flex",
                                                width: "100%",
                                                justifyContent: msg.user === "AI" ? "start" : "end",
                                                gap: 5,
                                                justifyItems: "center",
                                                alignItems: "center"
                                            }}>
                                                <div style={{width: 30, height: 30}}> {msg.user === "AI" &&
                                                    <Avatar label={msg.user.charAt(0)}
                                                            size="normal" style={{
                                                        backgroundColor: msg.user === "AI" ? '#2196F3' : '#ff00aa',
                                                        color: '#ffffff'
                                                    }} shape="circle"/>}</div>
                                                <div style={{
                                                    color: "#4a4a4a",
                                                    padding: 5,
                                                    fontSize: 14,
                                                    background: "linear-gradient(150deg, rgba(245,245,245,1) 26%, rgba(255,255,255,0.48363095238095233) 99%)",
                                                    borderRadius: 10,
                                                    fontFamily: "Poppins"
                                                }}>{msg.user === "Me" && msg?.inputType === "password" ? "******" : msg?.message} </div>
                                                {msg?.user !== "AI" &&
                                                    <Avatar label={msg.user.charAt(0)}
                                                            size="normal" style={{
                                                        backgroundColor: msg.user === "AI" ? '#2196F3' : '#ff00aa',
                                                        color: '#ffffff'
                                                    }} shape="circle"/>}

                                            </div>
                                            {msg.inputType === YES_NO && <motion.div
                                                initial={{opacity: 0, y: 50}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 50}}
                                                transition={{duration: 0.3}}
                                            >
                                                <div style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    gap: 10,
                                                    justifyContent: "center"
                                                }}>
                                                    <Chip icon={<ThumbsUp size={14}/>}
                                                          onClick={() => handleClick("yes")}
                                                          label="Yes" style={{
                                                        background: "#00B1B3",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                        fontSize: 12
                                                    }}/>
                                                    <Chip icon={<ThumbsDown size={14}/>}
                                                          onClick={() => handleClick("no")}
                                                          label="No" style={{
                                                        background: "#d1d1d1",
                                                        color: "#000",
                                                        cursor: "pointer",
                                                        fontSize: 12
                                                    }}/>
                                                </div>
                                            </motion.div>}

                                            {msg.inputType === LIST && (
                                                <motion.div
                                                    initial={{opacity: 0, y: 50}}
                                                    animate={{opacity: 1, y: 0}}
                                                    exit={{opacity: 0, y: 50}}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            width: "100%",
                                                            gap: 10,
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        {msg?.args?.map((role: string) => (
                                                            <Chip
                                                                key={role}  // Add a unique key for list rendering
                                                                icon={role === "admin" ? <User size={14}/> :
                                                                    <Users size={14}/>}
                                                                onClick={() => handleClick(role === "admin" ? "admin" : "user")}
                                                                label={role === "admin" ? "I'm Admin" : "I'm App user"}
                                                                style={{
                                                                    background: "#00B1B3",
                                                                    color: "#fff",
                                                                    cursor: "pointer",
                                                                    fontSize: 12,
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {msg.inputType === PROBLEM && <motion.div
                                                initial={{opacity: 0, y: 50}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 50}}
                                                transition={{duration: 0.3}}
                                            >
                                                <div style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    gap: 10,
                                                    justifyContent: "center"
                                                }}>
                                                                                                 </div>
                                            </motion.div>}
                                        </div>

                                    ))
                                }
                                {typing && (
                                    <div style={{ padding: 5, fontSize: 14, fontStyle: "italic", color: "#888" }}>
                                        AI is typing...
                                    </div>)
                                }

                                <div ref={messagesEndRef}/>
                            </div>
                            <div className="chat-input">
                                <InputText
                                    onKeyPress={handleKeyPress}
                                    value={message?.message ?? ""}
                                    onChange={(e) => inputMessage(e, incomingMessage[incomingMessage?.length - 1]?.inputType === "password" ? "password" : "text")}
                                    placeholder="Type a message..."
                                    style={{width: 320, height:50, padding:5}}
                                    className="p-inputtext-lg"
                                    type={incomingMessage[incomingMessage?.length - 1]?.inputType === "password" ? "password" : "text"}
                                />
                                <div style={{width: 50}}>
                                    <Button

                                        style={{backgroundColor: "#00B1B3", width:50, height:50, paddingRight:10}}
                                        icon={<Send size={16}/>}
                                        className="p-button-success send-btn"
                                        onClick={sendMessage}
                                        disabled={!message?.message?.trim()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </React.Fragment>
    );
};

export default ChatView;
