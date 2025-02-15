import React, {ChangeEvent, FC, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Button} from "primereact/button";
import {MessageCircle, Send} from "react-feather";
import "../App.css";
import {useMutation, useSubscription} from "@apollo/client";
import {CHAT_SEND_MESSAGE, CHAT_SUBSCRIPTION} from "../graphql/queries";
import {IMessage} from "../data/data";
import {InputText} from "primereact/inputtext";
import {Avatar} from "primereact/avatar";
import {v4 as uuidv4} from 'uuid';

const sessionId = uuidv4();
const ChatView: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<IMessage | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const {data: chat} = useSubscription(CHAT_SUBSCRIPTION, {
        variables: {message: {session: sessionId, user: "Me", message: "", inputType: "text", timestamp: 0}},
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
                            inputType: "text",
                            timestamp: new Date().getTime()
                        }
                    },
                });

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

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await sendMessage();
        }
    };

    const inputMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage({session: sessionId, user: "Me", message: e.target.value, inputType: "text", timestamp: Date.now()});
    };

    return (
        <React.Fragment>
            <Button
                className="floating-btn"
                icon={<MessageCircle/>}
                rounded
                aria-label="Open Chat"
                onClick={() => setIsOpen(!isOpen)}
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
                        <div className={"chat-box-header"}>
                            <h4>NCINGA HelpDesk</h4>
                            <h5>Ask us anything!</h5>
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
                                                justifyItems: "center"
                                            }}>
                                                <div style={{width: 30, height: 30}}><Avatar label={msg.user.charAt(0)}
                                                                                             size="normal" style={{
                                                    backgroundColor: msg.user === "AI" ? '#2196F3' : '#ff00aa',
                                                    color: '#ffffff'
                                                }} shape="circle"/></div>
                                                <div style={{padding: 2}}>{msg.message}</div>
                                            </div>
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
                                    className="p-inputtext-lg"
                                />
                                <div style={{width: 40}}>
                                    <Button
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
