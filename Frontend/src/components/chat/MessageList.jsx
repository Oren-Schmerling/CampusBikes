import React from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, chatEndRef }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div ref={chatEndRef} />
    </main>
  );
}
