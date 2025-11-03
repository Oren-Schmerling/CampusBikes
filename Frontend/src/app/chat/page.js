'use client';
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('John Doe');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const contacts = ['John Doe', 'Sarah Park', 'Emily Tran', 'Campus Support'];

  const [conversations, setConversations] = useState({
    'John Doe': [
      { id: 1, sender: 'rentee', text: 'Hey, this is John. Thanks for reaching out about the apartment!', time: new Date() },
    ],
    'Sarah Park': [
      { id: 2, sender: 'rentee', text: 'Hi! I’m Sarah, the owner. Are you still interested in the listing?', time: new Date() },
    ],
    'Emily Tran': [
      { id: 3, sender: 'rentee', text: 'Hello! This is Emily. Feel free to ask any questions about the place.', time: new Date() },
    ],
    'Campus Support': [
      { id: 4, sender: 'rentee', text: 'Hi, this is Campus Support. How can we assist you?', time: new Date() },
    ],
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = { id: Date.now(), sender: 'renter', text: message, time: new Date() };
    setConversations(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setMessage('');

    // Mock Rentee reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'rentee',
        text: 'Got it! I’ll get back to you shortly.',
        time: new Date(),
      };
      setConversations(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), reply],
      }));
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      <Sidebar
        contacts={contacts}
        conversations={conversations}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Chat section */}
      <div className="flex flex-col flex-1 relative z-10">
        <ChatHeader selectedChat={selectedChat} onMenuClick={() => setSidebarOpen(true)} />
        <MessageList
          messages={conversations[selectedChat] || []}
          chatEndRef={chatEndRef}
        />
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}