import React from 'react';
import { FiX } from 'react-icons/fi';

export default function Sidebar({
  contacts,
  conversations,
  selectedChat,
  setSelectedChat,
  sidebarOpen,
  setSidebarOpen,
}) {
  const getLastMessage = (name) => {
    const msgs = conversations[name];
    if (!msgs || msgs.length === 0) return '';
    return msgs[msgs.length - 1].text;
  };

  const getLastTime = (name) => {
    const msgs = conversations[name];
    if (!msgs || msgs.length === 0) return '';
    return new Date(msgs[msgs.length - 1].time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#f6f9f6] border-r border-gray-200 z-30 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-[#437223] font-bold text-lg">Chats</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-[#437223] hover:opacity-80"
        >
          <FiX size={22} />
        </button>
      </div>

      {/* People list */}
      <div className="flex flex-col overflow-y-auto">
        {contacts.map((person) => (
          <button
            key={person}
            onClick={() => {
              setSelectedChat(person);
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-5 py-3 border-b border-gray-100 hover:bg-[#e9f3e7] ${
              selectedChat === person ? 'bg-[#e9f3e7]' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[#437223]">{person}</p>
              <span className="text-xs text-gray-500">{getLastTime(person)}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{getLastMessage(person)}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
