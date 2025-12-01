/*
  function to handle messaging seller, used when Message Seller button on a card is clicked
  Still needs to be defined with proper parameters and backend endpoint
  */
const handleMessageSeller = async (listingId, messageContent) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("No authentication token found");
      return;
    }
    console.log("messaging seller for listing ID:", listingId, "with message:", messageContent);
    const body = {
      listingId: listingId,
      content: messageContent
    };

    const res = await fetch("http://localhost:8080/message/sendmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to send message:", error.message);
      return;
    }

    const data = await res.json();
    console.log("Message sent successfully:", data);
    return data;

  } catch (err) {
    console.error("Error messaging seller:", err);
  }
};

/*
  function to handle booking a listing, used when the book button on a card is clicked
  Still needs to be defined with proper parameters and backend endpoint
  */
const handleBook = async () => {
  // console.log("booking listing"); // debug log
  try {
    const res = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    });
  } catch (err) {
    console.error("Error creating booking:", err);
  }
};

export { handleMessageSeller, handleBook };
