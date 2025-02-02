import React, {FC, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {InputTextarea} from 'primereact/inputtextarea';
import {MessageCircle, Send} from "react-feather";
import '../App.css';
import {useSubscription} from "@apollo/client";
import {CHAT_SUBSCRIPTION} from "../graphql/queries";

const ChatView: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage("");
        }
    };

    const {data: conversation} = useSubscription(CHAT_SUBSCRIPTION, {
        variables: {chat: {user: 'shehan', message: 'hi..'}},
    });

    useEffect(() => {
        console.log(conversation)
         setMessages((message) => [...message, conversation?.chat?.message ?? ""])
    }, [conversation]);

    return (
        <React.Fragment>

            <Button className={"floating-btn"} icon={<MessageCircle/>} rounded aria-label="Filter"
                    onClick={() => setIsOpen(!isOpen)}/>

            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 50}}
                    transition={{duration: 0.3}}
                    className="chat-window"
                >
                    <Card
                        title="Chat"
                        subTitle="Ask us anything!"
                        className="chat-card"
                    >
                        <div className="chat-body">
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div key={index} className="chat-message">
                                        <div>{msg}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <InputTextarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    rows={3}
                                    className="p-inputtext-lg"
                                />
                                <Button
                                    icon={<Send size={16}/>}
                                    className="p-button-success send-btn"
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </React.Fragment>
    );
};

export default ChatView;
