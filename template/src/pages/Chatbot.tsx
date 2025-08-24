import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, Button, Input, message } from 'antd';
import { SendOutlined, MessageOutlined } from '@ant-design/icons';
import NavbarDark from '../components/NavbarDark';
import Footer from '../components/Footer';

const USER_AVATAR = "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg";
const BOT_AVATAR = "https://img.freepik.com/premium-vector/support-bot-ai-assistant-flat-icon-with-blue-support-bot-white-background_194782-1421.jpg?semt=ais_hybrid&w=740";

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5000';

    useEffect(() => {
        startConversation();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const startConversation = async () => {
        try {
            const res = await axios.post(`${CHATBOT_URL}/chatbot/start`, {}, { withCredentials: true });
            setMessages([{ text: res.data.message, sender: 'bot' }]);
            setIsFinished(false);
        } catch (err) {
            console.error('Error starting conversation:', err);
            setMessages([{ text: 'Error starting the chat.', sender: 'bot' }]);
            message.error('Failed to start conversation');
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isFinished) return;
        const userMessage: Message = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        try {
            const res = await axios.post(`${CHATBOT_URL}/chatbot/respond`, { input }, { withCredentials: true });
            const botMessage: Message = { text: res.data.message, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
            if (res.data.finished) {
                setIsFinished(true);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { text: 'Error processing your response.', sender: 'bot' }]);
            message.error('Failed to process response');
        }
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <NavbarDark />

            <div className='container mx-auto p-4 mt-17 mb-2'>
                <h1 className="text-3xl font-bold mb-2 ">Chat with bot</h1>
                <p className="text-lg text-gray-400 mb-6">Bot predict possible disease base on your symtomps</p>
                <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg h-[60vh] flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 px-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                            >
                                {msg.sender === 'bot' && (
                                    <Avatar src={BOT_AVATAR} alt="Bot" size={48} className="mr-2" />
                                )}
                                <div
                                    className={`max-w-[75%] p-3 rounded-lg ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    <p className="text-base">
                                        <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                                    </p>
                                </div>
                                {msg.sender === 'user' && (
                                    <Avatar src={USER_AVATAR} alt="User" size={48} className="!ml-2" />
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    {/* Input Section */}
                    {!isFinished ? (
                        <Input
                            size="large"
                            placeholder="Type your response..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            prefix={<MessageOutlined className="text-blue-500" />}
                            suffix={
                                <Button
                                    type="text"
                                    icon={<SendOutlined />}
                                    onClick={handleSendMessage}
                                    className="text-blue-500"
                                />
                            }
                            className="text-base"
                        />
                    ) : (
                        <Button
                            type="primary"
                            block
                            size="large"
                            onClick={startConversation}
                            className="mt-2 bg-green-500 hover:bg-green-600"
                        >
                            Start New Chat
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Chatbot;