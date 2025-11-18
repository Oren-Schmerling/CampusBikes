'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMenu, FiX } from 'react-icons/fi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState(null);
  const [conversations, setConversations] = useState({});

  // Get username from JWT
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found. Please login.');
      window.location.href = '/login';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub);
    } catch (err) {
      console.error('Invalid token', err);
    }
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!username || !selectedChat) return;

    async function fetchMessages() {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch('http://localhost:8080/message/getall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otherUsername: selectedChat }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setConversations((prev) => ({
          ...prev,
          [selectedChat]: data.messages.map((m) => ({
            id: m.id,
            sender: m.senderId === username ? 'user' : 'ai',
            text: m.content,
          })),
        }));
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    }

    fetchMessages();
  }, [username, selectedChat]);

  // STOMP WebSocket connection
  useEffect(() => {
    if (!username) return;

    const token = localStorage.getItem('authToken');
    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        client.subscribe('/user/queue/messages', (msg) => {
          const cleanedBody = msg.body.replace(/\0/g, '');
          try {
            const body = JSON.parse(cleanedBody);
            setConversations((prev) => ({
              ...prev,
              [body.senderId]: [
                ...(prev[body.senderId] || []),
                { id: Date.now(), sender: 'ai', text: body.content },
              ],
            }));
          } catch (err) {
            console.error('Error parsing STOMP message:', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => client.deactivate();
  }, [username]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    setConversations((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), { id: Date.now(), sender: 'user', text: message }],
    }));

    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          senderId: username,
          recipientId: selectedChat,
          content: message,
          type: 'CHAT',
        }),
      });
    }

    setMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[#437223] font-bold text-lg">Contacts</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#437223] hover:opacity-80">
            <FiX size={22} />
          </button>
        </div>
        <div className="flex flex-col">
          {/* Render contacts dynamically from conversations */}
          {Object.keys(conversations).map((contact) => (
            <button
              key={contact}
              onClick={() => { setSelectedChat(contact); setSidebarOpen(false); }}
              className={`w-full text-left px-5 py-4 font-medium text-[#437223] border-b border-gray-100 hover:bg-[#e9f3e7] ${selectedChat === contact ? 'bg-[#e9f3e7]' : ''}`}
            >
              {contact}
            </button>
          ))}
        </div>
      </aside>

      <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}></div>

      {/* Chat section */}
      <div className="flex flex-col flex-1 relative z-10">
        <header className="bg-white border-b border-[#437223] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-[#437223] hover:opacity-80 lg:hidden">
              <FiMenu size={24} />
            </button>
            <h1 className="text-[#437223] font-bold text-lg">{selectedChat || 'Select a chat'}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {(conversations[selectedChat] || []).map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-xl max-w-[70%] break-words ${msg.sender === 'user' ? 'bg-[#f0f7ef] text-[#437223] rounded-br-xl' : 'bg-[#437223] text-white rounded-bl-xl'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <div className="border-t border-[#437223] p-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-[#437223] rounded-full focus:outline-none focus:ring-2 focus:ring-[#437223]"
          />
          <button onClick={handleSendMessage} disabled={!message.trim()} className="bg-[#437223] text-white p-2 rounded-full disabled:opacity-50 hover:opacity-90">
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
