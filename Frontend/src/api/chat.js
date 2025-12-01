// src/api/chatApi.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

/**
 * Connect to WebSocket using STOMP
 * @param {string} token - JWT token for authentication
 * @param {function} onMessage - callback for receiving messages
 */
export const connectChatSocket = (token, onMessage) => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS("http://localhost:8080/ws"); // <--- your backend WS endpoint

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("Connected to chat WebSocket");

        // Listen for incoming messages
        stompClient.subscribe("/user/queue/messages", (message) => {
          const body = JSON.parse(message.body);
          onMessage(body);
        });

        resolve(true);
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        reject(frame);
      },
    });

    stompClient.activate();
  });
};

/**
 * Disconnect WebSocket
 */
export const disconnectChatSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("Chat WebSocket disconnected.");
  }
};

/**
 * Send chat message
 * @param {*} senderId 
 * @param {*} recipientId 
 * @param {*} content 
 */
export const sendChatMessage = (senderId, recipientId, content) => {
  if (!stompClient || !stompClient.connected) {
    console.error("Cannot send message: WebSocket not connected.");
    return;
  }

  const chatMessage = {
    senderId,
    recipientId,
    content,
  };

  stompClient.publish({
    destination: "/app/chat.sendMessage",
    body: JSON.stringify(chatMessage),
  });

  console.log("Message sent:", chatMessage);
};
