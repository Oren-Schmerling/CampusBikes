'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
// 🔑 Import FiClipboard for the button icon
import { FiSend, FiMenu, FiX, FiClipboard } from 'react-icons/fi'; 
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 💡 Current User placeholder
const CURRENT_USERNAME = 'Tester2'; 
const SCHOOL_USERNAME = 'School'; // 🔑 Define the target username

export default function ChatPage() {
  const [message, setMessage] = useState('');
  // 🔑 Set initial selectedChat to 'School'
  const [selectedChat, setSelectedChat] = useState(SCHOOL_USERNAME); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  
  const DUMMY_MODE = true; 
  // 🔑 Add 'School' to the dummy contacts list
  const initialContacts = ['John Doe', 'Sarah Park', 'Emily Tran', SCHOOL_USERNAME]; 
  const [contacts, setContacts] = useState(initialContacts); 


  const clientRef = useRef(null); 
  const [connected, setConnected] = useState(false);
  
  const [conversations, setConversations] = useState({});

  
  // --- DUMMY IMPLEMENTATION: Fetch contacts on mount ---
  const fetchContacts = useCallback(() => {
      // For DUMMY_MODE, just use the hardcoded list
      if (DUMMY_MODE) {
          setContacts(initialContacts);
      } 
      // In a real app, this would be an API call
  }, []);


  // --- Fetch chat history for selected contact ---
  const fetchChatHistory = useCallback(async (contactUsername) => {
    // ... (Your real API fetching logic is here)

    if (DUMMY_MODE) {
      const dummyMessages = [
          { id: '1', sender: CURRENT_USERNAME, text: `Hello ${contactUsername}!`, time: new Date(Date.now() - 60000) },
          { id: '2', sender: contactUsername, text: 'How can I help?', time: new Date(Date.now() - 30000) },
      ];

      setConversations(prev => ({
          ...prev,
          [contactUsername]: dummyMessages
      }));
    }
  }, []);


  // --- Utility Function: Sends message via STOMP and updates local state ---
  const sendMessage = useCallback((destination, chatMessage) => {
    if (clientRef.current && connected) {
      
      clientRef.current.publish({
        destination,
        body: JSON.stringify(chatMessage)
      });

      const newMsg = { 
          id: chatMessage.id,
          sender: CURRENT_USERNAME, 
          text: chatMessage.content,
          time: new Date(), 
      };

      setConversations(prev => ({
          ...prev,
          // Use the recipientId from the chatMessage object for correct conversation target
          [chatMessage.recipientId]: [...(prev[chatMessage.recipientId] || []), newMsg],
      }));
      setMessage('');
      
    } else {
        console.warn("STOMP client is not connected. Message not sent.");
    }
  }, [connected, selectedChat]);


  // --- 🔑 NEW HANDLER: Send a dummy message to 'School' ---
  const sendDummySchoolMessage = () => {
    if (!connected) {
        console.warn("Cannot send dummy message: WebSocket is not connected.");
        return;
    }
    
    // Ensure the School chat is selected when the button is pressed
    setSelectedChat(SCHOOL_USERNAME);

    const dummyContent = `[AUTOMATED] Urgent Bike Status Check requested by ${CURRENT_USERNAME}.`;

    // 1. Construct the ChatMessage object targeting SCHOOL_USERNAME
    const chatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
        senderId: CURRENT_USERNAME, 
        recipientId: SCHOOL_USERNAME,  // Target the 'School' username
        content: dummyContent,
    };

    // 2. Use the existing sendMessage utility
    sendMessage(
      "/app/chat.sendMessage", 
      chatMessage
    );
    
    // 3. Provide a mock reply immediately for visual feedback in dummy mode
    if (DUMMY_MODE) {
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: SCHOOL_USERNAME,
                text: 'We received your automated request. The bike status is pending review.',
                time: new Date(),
            };
            setConversations(prev => ({
                ...prev,
                [SCHOOL_USERNAME]: [...(prev[SCHOOL_USERNAME] || []), reply],
            }));
        }, 500);
    }
  };


  // --- Handler: Calls sendMessage for regular input ---
  const handleSendMessage = () => {
    if (!message.trim() || !connected || !selectedChat) return;

    const chatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
        senderId: CURRENT_USERNAME, 
        recipientId: selectedChat,  
        content: message.trim(),
    };

    sendMessage(
      "/app/chat.sendMessage", 
      chatMessage
    );
  };
  
  // --- useEffect: Fetch contacts on mount ---
  useEffect(() => {
    fetchContacts();
    // Ensure history is loaded for the initial selected chat (School)
    if (selectedChat) {
        fetchChatHistory(selectedChat);
    }
  }, [fetchContacts]);

  // --- useEffect: Fetch chat history when contact is selected ---
  useEffect(() => {
    if (selectedChat) {
      fetchChatHistory(selectedChat);
    }
  }, [selectedChat, fetchChatHistory]);

  // --- useEffect: WebSocket Connection and Subscription (Unchanged) ---
  useEffect(() => {
    let jwtToken = localStorage.getItem("authToken");

    if (!jwtToken) {
      console.error("No user data found. Please login first.");
      return;
    }

    const socketFactory = () => new SockJS(`http://localhost:8080/ws?token=${jwtToken}`);
    
    const client = new Client({
      webSocketFactory: socketFactory,
      onConnect: (frame) => {
        setConnected(true);

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
            // Update contacts list if a new sender appears
            setContacts(prev => {
              if (!prev.includes(receivedMessage.sender) && receivedMessage.sender !== CURRENT_USERNAME) {
                return [...prev, receivedMessage.sender];
              }
              return prev;
            });

          } catch (error) {
            console.error('Error parsing message body at client:', error);
          }
        });
      },

      onStompError: (frame) => {
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate(); 

    return () => {
      if (clientRef.current && clientRef.current.active) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // --- useEffect: Scroll to bottom ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat]);


  // --- JSX RENDER ---
  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[#437223] font-bold text-lg">Contacts</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#437223] hover:opacity-80"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* 🔑 NEW: School Support Button */}
        <div className="p-4 border-b border-gray-200">
            <button
                onClick={sendDummySchoolMessage}
                disabled={!connected}
                className="w-full text-left px-3 py-2 text-white bg-[#437223] rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center"
            >
                <FiClipboard className="mr-2" size={16} />
                Send School Check
            </button>
        </div>

        {/* Contacts list */}
        <div className="flex flex-col">
          {contacts.length === 0 ? (
            <div className="px-5 py-4 text-gray-500 text-sm">No contacts yet</div>
          ) : (
            contacts.map((person) => (
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
            ))
          )}
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
        {selectedChat ? (
          <>
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

            {/* Input */}
            <div className="border-t border-[#437223] p-3 flex items-center gap-2">
              <input
                type="text"
                placeholder={connected ? "Type a message..." : "Connecting..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!connected} 
                className="flex-1 px-4 py-2 border border-[#437223] rounded-full focus:outline-none focus:ring-2 focus:ring-[#437223] disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !connected}
                className="bg-[#437223] text-white p-2 rounded-full disabled:opacity-50 hover:opacity-90"
              >
                <FiSend size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mb-4 text-[#437223] hover:opacity-80"
              >
                <FiMenu size={32} className="mx-auto" />
              </button>
              <p className="text-lg">Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}