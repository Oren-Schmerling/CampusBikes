import React from 'react';
import { FiMenu } from 'react-icons/fi';

export default function ChatHeader({ selectedChat, onMenuClick }) {
  return (
    <header className="bg-white border-b border-[#437223] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-[#437223] hover:opacity-80 lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-[#437223] font-bold text-lg">{selectedChat}</h1>
      </div>
    </header>
  );
}
