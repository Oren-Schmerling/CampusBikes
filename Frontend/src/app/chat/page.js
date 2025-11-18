'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiMenu, FiX } from 'react-icons/fi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 💡 1. Sender is 'wesh' as requested
const CURRENT_USERNAME = 'wesh'; 

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState(['John Doe', 'Sarah Park', 'School']); // Added School to list
  const chatEndRef = useRef(null);

  const clientRef = useRef(null); 
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState({});

  // --- 2. This function hits your Java @MessageMapping("/chat.sendMessage") ---
  const sendMessage = useCallback((destination, chatMessage) => {
    if (clientRef.current && connected) {
      
      // ⚡ THIS IS THE API CALL ⚡
      // It sends the data through the socket to your Java Controller
      clientRef.current.publish({
        destination,
        body: JSON.stringify(chatMessage)
      });

      // Update UI immediately
      const newMsg = { 
          id: chatMessage.id || Date.now(),
          sender: CURRENT_USERNAME, 
          text: chatMessage.content,
          time: new Date(), 
      };

      const targetChat = chatMessage.recipientId;

      setConversations(prev => ({
          ...prev,
          [targetChat]: [...(prev[targetChat] || []), newMsg],
      }));
      setMessage('');
      
    } else {
        alert("STOMP client is not connected. Cannot send message.");
    }
  }, [connected]);

  // --- 🔴 3. The Test Button Logic You Requested ---
  const sendToSchool = () => {
    // Switch view to school so you can see the chat
    setSelectedChat('School');

    const chatMessage = {
        // senderId: 'wesh' (from const above)
        senderId: CURRENT_USERNAME, 
        
        // recipientId: 'School' (Must exist in your DB 'users' table!)
        recipientId: 'School',     
        
        // content: 'Hello'
        content: 'Hello'           
    };

    console.log("Sending to API:", chatMessage);

    // Calls the function that publishes to your backend
    sendMessage("/app/chat.sendMessage", chatMessage);
  };

  // --- Normal Send Handler ---
  const handleSendMessage = () => {
    if (!message.trim() || !connected || !selectedChat) return;

    const chatMessage = {
        senderId: CURRENT_USERNAME, 
        recipientId: selectedChat,  
        content: message.trim(),
    };

    sendMessage("/app/chat.sendMessage", chatMessage);
  };

  // --- WebSocket Connection Setup ---
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Assuming you need auth
    
    // Connect to your Spring Boot Endpoint
    const socketFactory = () => new SockJS(`http://localhost:8080/ws?token=${token}`);
    
    const client = new Client({
      webSocketFactory: socketFactory,
      onConnect: (frame) => {
        console.log('Connected to WebSocket');
        setConnected(true);

        // Listen for incoming messages from backend
        client.subscribe('/user/queue/messages', (message) => {
          const cleanedBody = message.body.replace(/\0/g, '');
          try {
            const body = JSON.parse(cleanedBody);
            const receivedMessage = {
                id: body.id,
                sender: body.senderId, 
                text: body.content,
                time: new Date(body.timestamp), 
            };

            setConversations(prev => {
                const chatPartner = receivedMessage.sender === CURRENT_USERNAME
                    ? body.recipientId 
                    : receivedMessage.sender; 

                return {
                    ...prev,
                    [chatPartner]: [...(prev[chatPartner] || []), receivedMessage],
                };
            });
          } catch (error) {
            console.error('Error parsing message:', error);
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
      if (clientRef.current) clientRef.current.deactivate();
    };
  }, []);

  // --- Scroll to bottom ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);


  // --- RENDER ---
  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[#437223] font-bold text-lg">Contacts</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#437223]">
            <FiX size={22} />
          </button>
        </div>

        {/* 🔴 4. THE BUTTON YOU ASKED FOR */}
        <div className="p-4 border-b border-gray-200">
            <button 
                onClick={sendToSchool}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Send "Hello" to School
            </button>
        </div>

        {/* Contacts List */}
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

      {/* Mobile Overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      ></div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 relative z-10">
        {selectedChat ? (
          <>
            <header className="bg-white border-b border-[#437223] p-4 flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="text-[#437223] lg:hidden">
                  <FiMenu size={24} />
                </button>
                <h1 className="text-[#437223] font-bold text-lg">{selectedChat}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
              {(conversations[selectedChat] || []).map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.sender === CURRENT_USERNAME ? 'justify-end' : 'justify-start'}`} 
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[70%] break-words ${
                      msg.sender === CURRENT_USERNAME
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

            <div className="border-t border-[#437223] p-3 flex items-center gap-2">
              <input
                type="text"
                placeholder={connected ? "Type a message..." : "Connecting..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!connected} 
                className="flex-1 px-4 py-2 border border-[#437223] rounded-full focus:outline-none focus:ring-2 focus:ring-[#437223]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !connected}
                className="bg-[#437223] text-white p-2 rounded-full disabled:opacity-50"
              >
                <FiSend size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
             <p>Select a contact or click the button to test</p>
          </div>
        )}
      </div>
    </div>
  );
}