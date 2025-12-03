import React from 'react';

export default function MessageBubble({ msg }) {
  const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isRenter = msg.sender === 'renter';

  return (
    <div className={`flex ${isRenter ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] break-words shadow-sm ${
          isRenter
            ? 'bg-[#eaf9e6] text-[#2d6628] rounded-br-xl'
            : 'bg-[#437223] text-white rounded-bl-xl'
        }`}
      >
        <p>{msg.text}</p>
        <p className="text-xs mt-1 opacity-70 text-right">{time}</p>
      </div>
    </div>
  );
}
