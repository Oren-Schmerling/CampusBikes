"use client";

import { useState } from "react";
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const MessageSellerForm = ({ id, seller, title, onSend, onBack }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.stopPropagation();
    if (message.trim()) {
      console.log("Sending message to seller:", id, "Message:", message);
      onSend(id, message);
      setMessage('');
    }
  };

  const handleBack = (e) => {
    e.stopPropagation();
    onBack();
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onBack();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Message Seller
        </h2>

        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              {seller && title &&
                <>Contact {seller} to discuss pricing or ask questions about renting {title}.</>}

              {seller && !title &&
                <>Contact {seller} to discuss pricing or ask questions.</>}

              {!seller && title &&
                <>Contact the seller to discuss pricing or ask questions about renting {title}.</>}

              {!seller && !title &&
                <>Contact the seller to discuss pricing or ask questions.</>}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${seller || 'there'}, I'm interested in renting your listing${title ? ` for ${title}` : ''}, ...`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={6}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-waxwingGreen text-white rounded-lg font-medium hover:bg-waxwingLightGreen transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!message.trim()}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MessageSellerForm;