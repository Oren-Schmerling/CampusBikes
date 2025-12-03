import React from 'react';
import { FiSend } from 'react-icons/fi';

export default function MessageInput({ message, setMessage, handleSendMessage }) {
  return (
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
  );
}
