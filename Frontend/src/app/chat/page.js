'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiMenu, FiX } from 'react-icons/fi';
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

// Utility function to decode the JWT payload
// NOTE: This is a basic function. For production, consider a robust library or a secure backend call.
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('school');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(null); // State to store the decoded current username

  const [conversations, setConversations] = useState({
    school: [],
    Ashray: []
  });

  // These are the users you want to chat with. The current user's username is stored in 'currentUsername'.
  const contacts = ['school', 'Ashray'];

  // --- Initial Setup: Decode JWT and Fetch Chat History ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = decodeJwt(token);
      // Assuming the username/subject is stored in the 'sub' claim of the JWT payload
      const username = decodedToken ? decodedToken.sub : null;
      setCurrentUsername(username);

      if (!username) {
        console.error("Could not extract username from token.");
        window.location.href = '/login';
        return;
      }
      
      // We no longer rely on localStorage.getItem("username") directly for fetching
      // but use the decoded username.
      localStorage.setItem("username", username); // Ensure localStorage has it for the subsequent functions

    } else {
      console.error("Missing token");
      window.location.href = '/login';
      return;
    }
    
    async function fetchMessages() {
      try {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username"); // Use the updated username from the effect

        if (!token || !username) {
          return;
        }

        async function loadChat(otherUsername) {
          const res = await fetch("http://localhost:8080/message/getall", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ otherUsername })
          });

          const data = await res.json();

          const formatted = data.messages.map((m) => ({
            id: m.id,
            // Compare the senderUsername from the message with the current user's username
            sender: m.senderUsername === username ? "user" : "ai", 
            text: m.content
          }));

          setConversations((prev) => ({
            ...prev,
            [otherUsername]: formatted
          }));
        }

        await loadChat("school");
        await loadChat("Ashray");

      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, []);

  // ------------------------------------------------------------------
  // WEBSOCKET CONNECTION
  // ------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username"); // Use the username set in the previous effect

    if (!token || !username) {
      // Login redirection is handled in the setup effect
      return;
    }

    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),

      onConnect: () => {
        setConnected(true);

        // Subscribe to the private user queue for incoming messages
        client.subscribe('/user/queue/messages', (msg) => {
          const cleaned = msg.body.replace(/\0/g, '');
          const body = JSON.parse(cleaned);

          const incomingMsg = {
            id: body.id || Date.now(),
            // Determine if the message is from the user or the other party
            sender: body.senderUsername === username ? "user" : "ai", 
            text: body.content
          };

          const other =
            body.senderUsername === username // If I sent it, the "other" is the recipient
              ? body.recipientUsername
              : body.senderUsername; // If someone else sent it, the "other" is the sender

          // Update the conversation for the determined 'other' user
          setConversations((prev) => ({
            ...prev,
            [other]: [...(prev[other] || []), incomingMsg]
          }));
        });
      },

      onStompError: (frame) => {
        console.error("WebSocket STOMP error:", frame);
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => client.deactivate();
  }, []); // Empty dependency array means this runs once on mount

  // ------------------------------------------------------------------
  // SEND MESSAGE - Uses decoded user ID and selectedChat for recipient
  // ------------------------------------------------------------------
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !currentUsername) return;

    // 1. Sender ID is the decoded username from JWT (stored in currentUsername state)
    // 2. Recipient ID is the currently selected chat (stored in selectedChat state)
    const outgoingMsg = {
      senderId: currentUsername, 
      recipientId: selectedChat, 
      content: message,
      type: "CHAT"
    };

    console.log("Sending message:", outgoingMsg);

    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(outgoingMsg)
      });
    }

    // Optimistically update the UI with the sent message
    setConversations((prev) => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        { id: Date.now(), sender: "user", text: message }
      ]
    }));

    setMessage('');
  }, [message, currentUsername, selectedChat, connected]); // Include dependencies

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);

  // --------------------------------------------------------------
  // UI
  // --------------------------------------------------------------
  if (!currentUsername) {
    return (
        <div className="flex h-screen items-center justify-center bg-white">
            <p className="text-[#437223]">Loading user data or redirecting...</p>
        </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
            <h2 className="text-[#437223] font-bold text-lg">Your Username: {currentUsername}</h2>
            <div className="flex justify-between items-center">
                <h2 className="text-[#437223] font-bold text-lg">People</h2>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#437223]">
                    <FiX size={22} />
                </button>
            </div>
        </div>

        <div className="flex flex-col">
          {contacts
          .filter(person => person !== currentUsername) // Do not list yourself
          .map((person) => (
            <button
              key={person}
              onClick={() => {
                setSelectedChat(person);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-5 py-4 font-medium text-[#437223] border-b border-gray-100 hover:bg-[#e9f3e7]
              ${selectedChat === person ? 'bg-[#e9f3e7]' : ''}`}
            >
              {person}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 lg:hidden
        ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      ></div>

      {/* Main */}
      <div className="flex flex-col flex-1 relative z-10">
        <header className="bg-white border-b border-[#437223] p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#437223] lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-[#437223] font-bold text-lg">Chatting with: {selectedChat}</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {(conversations[selectedChat] || []).map((msg, index) => (
            <div key={msg.id || index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] break-words ${
                  msg.sender === 'user'
                    ? 'bg-[#f0f7ef] text-[#437223] rounded-br-none' // Changed: rounded-br-xl -> rounded-br-none
                    : 'bg-[#437223] text-white rounded-bl-none' // Changed: rounded-bl-xl -> rounded-bl-none
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
            placeholder={`Message ${selectedChat}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-[#437223] rounded-full focus:ring-2 focus:ring-[#437223]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || !connected}
            className="bg-[#437223] text-white p-2 rounded-full disabled:opacity-50 hover:opacity-90"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}