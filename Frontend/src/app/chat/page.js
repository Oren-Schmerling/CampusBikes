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
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
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
  const [selectedChat, setSelectedChat] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(null); // State to store the decoded current username

  // conversations keyed by username
  const [conversations, setConversations] = useState({});

  // contacts state (fixed: previously was a const)
  const [contacts, setContacts] = useState([]);

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

      // Ensure localStorage has username for other pieces of code that rely on it
      localStorage.setItem("username", username);
    } else {
      console.error("Missing token");
      window.location.href = '/login';
      return;
    }

    // fetchMessages defined and invoked within effect
    async function fetchMessages() {
      try {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");

        if (!token || !username) return;

        // 1️⃣ Fetch list of people I have chatted with
        const res = await fetch("http://localhost:8080/message/getrecipients", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          console.error("Failed to fetch recipients:", res.status, await res.text());
          return;
        }

        const data = await res.json();
        const userList = Array.isArray(data.usernames) ? data.usernames : [];

        // set contacts
        setContacts(userList);

        // default selected chat: first recipient if available, else keep empty
        setSelectedChat(userList[0] || '');

        // 2️⃣ Load chat with each person
        async function loadChat(otherUsername) {
          try {
            const res = await fetch("http://localhost:8080/message/getall", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ otherUsername })
            });

            if (!res.ok) {
              console.error(`Failed to load chat for ${otherUsername}:`, res.status, await res.text());
              return;
            }

            const chatData = await res.json();
            console.log(chatData)
            const formatted = Array.isArray(chatData.messages) ? chatData.messages.map((m) => ({
              id: m.id,
              text: m.content,
              sender: m.senderUsername === username ? "user" : "ai"
            })) : [];

            setConversations((prev) => ({
              ...prev,
              [otherUsername]: formatted
            }));
          } catch (err) {
            console.error("Error loading chat for", otherUsername, err);
          }
        }

        // Load chats sequentially (keeps things predictable)
        for (const user of userList) {
          await loadChat(user);
        }

      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, []); // run once on mount

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

    // create client with a factory to ensure fresh SockJS on each activation
    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${token}`),
      debug: (str) => {
        // keep debug logs but not too spammy
        // console.log('STOMP:', str);
      },

      onConnect: (frame) => {
        setConnected(true);
        console.log(frame)

        // Subscribe to the private user queue for incoming messages
        // Note: subscription callback uses latest state setter to append incoming messages
        client.subscribe('/user/queue/messages', (msg) => {
          try {
            const cleaned = msg.body ? msg.body.replace(/\0/g, '') : '{}';
            const body = JSON.parse(cleaned);

            const incomingMsg = {
              id: body.id || Date.now(),
              text: body.content,
              sender: body.senderId === username ? "user" : "ai"
            };

            const other =
              body.senderId === username
                ? body.recipientId
                : body.senderId;


            setConversations((prev) => {
              const updated = {
                ...prev,
                [other]: [...(prev[other] || []), incomingMsg]
              };
              return updated;
            });
          } catch (err) {
            console.error("Failed to parse incoming WS message:", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("WebSocket STOMP error:", frame);
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      try {
        client.deactivate();
      } catch (err) {
        // ignore
      }
      clientRef.current = null;
      setConnected(false);
    };
  }, []); // run once

  // ------------------------------------------------------------------
  // SEND MESSAGE - Uses decoded user ID and selectedChat for recipient
  // ------------------------------------------------------------------
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !currentUsername) return;

    // If no selected chat, fall back to 'ashray' to match your earlier request
    const recipient = selectedChat || 'ashray';

    const outgoingMsg = {
      senderId: currentUsername,
      recipientId: recipient,
      content: message,
      type: "CHAT"
    };

    console.log("Sending message:", outgoingMsg);

    if (clientRef.current && connected) {
      try {
        console.log(outgoingMsg)
        clientRef.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(outgoingMsg)
        });
      } catch (err) {
        console.error("Failed to publish message via STOMP:", err);
      }
    } else {
      console.warn("WebSocket not connected — message will still be added to UI optimistically.");
    }

    // Optimistically update the UI with the sent message
    setConversations((prev) => ({
      ...prev,
      [recipient]: [
        ...(prev[recipient] || []),
        { id: Date.now(), sender: "user", text: message }
      ]
    }));

    // If there was no selectedChat and we defaulted to 'ashray', also ensure contacts includes them
    setContacts((prev) => {
      if (!prev.includes(recipient)) {
        return [...prev, recipient];
      }
      return prev;
    });

    // Set selected chat to recipient if nothing was selected before
    if (!selectedChat) {
      setSelectedChat(recipient);
    }

    setMessage('');
  }, [message, currentUsername, selectedChat, connected]);

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
                className={`px-4 py-2 rounded-xl max-w-[70%] break-words ${msg.sender === 'user'
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
