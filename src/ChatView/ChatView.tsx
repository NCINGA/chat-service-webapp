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
// import {v4 as uuidv4} from 'uuid';
import {Chip} from "primereact/chip";
import "primeicons/primeicons.css";

const sessionId = "test";
const ChatView: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<IMessage | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const {data: chat} = useSubscription(CHAT_SUBSCRIPTION, {
        variables: {message: {session: sessionId, user: "Me", message: "", inputType: TEXT, timestamp: 0}},
        shouldResubscribe: false
    });

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
            }
        }
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = async () => {
        if (message !== null && message.message.trim()) {
            try {
                await sendMessageToServer({
                    variables: {
                        message: {
                            session: sessionId,
                            user: "Me",
                            message: message.message,
                            inputType: TEXT,
                            timestamp: new Date().getTime(),
                            args: null
                        }
                    },
                });

                console.log(message);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    message
                ]);
                setMessage(null);
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

    const inputMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage({
            session: sessionId,
            user: "Me",
            message: e.target.value,
            inputType: TEXT,
            timestamp: Date.now(),
            args: null
        });
    };

    return (
        <React.Fragment>
            <Button
                style={{background: "#00B1B3", border: "#fff"}}
                className="floating-btn"
                icon={<MessageCircle/>}
                rounded
                aria-label="Open Chat"
                onClick={() => {
                    setIsOpen(!isOpen);
                    handleClick("hi");
                }}
            />

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
                                                }}>{msg.message ?? ""} </div>
                                                {msg.user !== "AI" &&
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
                                                                label={role === "admin" ? "I'm Admin" : "I'm User"}
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
                                                    <img width={80} height={80}
                                                         src={"data:image/png;base64,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"}/>
                                                </div>
                                            </motion.div>}
                                        </div>

                                    ))
                                }

                                <div ref={messagesEndRef}/>
                            </div>
                            <div className="chat-input">
                                <InputText
                                    onKeyPress={handleKeyPress}
                                    value={message?.message ?? ""}
                                    onChange={inputMessage}
                                    placeholder="Type a message..."
                                    style={{width: 240}}
                                />
                                <div style={{width: 40}}>
                                    <Button
                                        style={{backgroundColor: "#00B1B3"}}
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
