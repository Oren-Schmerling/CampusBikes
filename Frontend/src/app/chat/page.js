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

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);


  const contacts = ['John Doe', 'Sarah Park', 'Emily Tran', 'Campus Support'];

  const [conversations, setConversations] = useState({
    'John Doe': [
      { id: 1, sender: 'rentee', text: 'Hey, this is John. Thanks for reaching out about the scooter!', time: new Date() },
    ],
    'Sarah Park': [
      { id: 2, sender: 'rentee', text: 'Hi! I’m Sarah, the owner. Are you still interested in the listing?', time: new Date() },
    ],
    'Emily Tran': [
      { id: 3, sender: 'rentee', text: 'Hello! This is Emily. Feel free to ask any questions about the bike.', time: new Date() },
    ],
    'Campus Support': [
      { id: 4, sender: 'rentee', text: 'Hi, this is Campus Support. How can we assist you?', time: new Date() },
    ],
  });

  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = localStorage.getItem('authToken');


        const res = await fetch('http://localhost:8080/message/getall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ otherUsername: "Tester2" })  // Changed to object
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        console.log(data.messages); // Your messages are in data.messages
        // setMessages(data.bikes); // Store in state

      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, []);

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
    // Get user data from storage
    let jwtToken = localStorage.getItem("authToken");

    if (!jwtToken) {
      console.error("No user data found. Please login first.");
      window.location.href = '/login';
      return;
    }

    // Add the username as a query parameter to the SockJS URL
    const socket = new SockJS(`http://localhost:8080/ws?token=${jwtToken}`);

    const client = new Client({
      webSocketFactory: () => socket,

      debug: (str) => {
        console.log('STOMP:', str);
      },

      onConnect: (frame) => {
        console.log('Connected');
        setConnected(true);

        client.subscribe('/user/queue/messages', (message) => {
          console.log('Private message received:');
          //Clean the body by removing the null character
          const cleanedBody = message.body.replace(/\0/g, '');

          try {
            const body = JSON.parse(cleanedBody);
            console.log('Private message received by Tester2:', body);

          } catch (error) {
            console.error('Error parsing message body at client:', error);
            console.error('Raw content that failed to parse:', message.body);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      });
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[#437223] font-bold text-lg">People</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#437223] hover:opacity-80"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* People list */}
        <div className="flex flex-col">
          {contacts.map((person) => (
            <button
              key={person}
              onClick={() => {
                setSelectedChat(person);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-5 py-4 font-medium text-[#437223] border-b border-gray-100 hover:bg-[#e9f3e7] ${
                selectedChat === person ? 'bg-[#e9f3e7]' : ''
              }`}
            >
              {person}
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Chat section */}
      <div className="flex flex-col flex-1 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-[#437223] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#437223] hover:opacity-80 lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-[#437223] font-bold text-lg">{selectedChat}</h1>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {(conversations[selectedChat] || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] break-words ${
                  msg.sender === 'user'
                    ? 'bg-[#f0f7ef] text-[#437223] rounded-br-xl'
                    : 'bg-[#437223] text-white rounded-bl-xl'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        {/* Input */}
        <div className="border-t border-[#437223] p-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-[#437223] rounded-full focus:outline-none focus:ring-2 focus:ring-[#437223]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-[#437223] text-white p-2 rounded-full disabled:opacity-50 hover:opacity-90"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}