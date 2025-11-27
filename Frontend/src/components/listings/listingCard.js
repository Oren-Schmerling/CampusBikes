import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRef } from "react";
import { MapPin, User, Calendar, Clock, DollarSign, X } from "lucide-react";
import BookingModal from "@/components/listings/bookingModal";
import MessageSellerForm from "@/components/listings/messageSellerForm";

/*
Package for icons used in the listing card component
currently using MapPin and User icons from lucide-react
can change packages if needed

run npm install lucide-react in the frontend folder if not installed
*/

const ListingCard = ({
  imageSrc,
  model,
  distance, // might be easier to have this be location instead of distance
  pricePerHour,
  seller,
  rating,
  id,
  onMessageSeller, // functions to message seller and book a bike
  onBook,
  onClick,
  description,
  location,
  selectedListing,
  bike,
}) => {
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const selectedCard = useRef(null);

  const handleOpenBookModal = () => {
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
  };

  const handleOpenMessageForm = () => {
    setShowMessageForm(true);
  };

  const handleCloseMessageForm = () => {
    setShowMessageForm(false);
  };

  return (
    <div
      id={id}
      onClick={onClick} // handle card click
      className={
        bike === selectedListing
          ? "w-75 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out shadow-xl scale-110 -translate-y-1 hover:cursor-pointer"
          : "w-75 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
      }
    >
      {/* Image area, temporary placeholder, need to format correctly for what backend returns */}
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={imageSrc || "/bike.jpg"}
          alt={model ? model : "image of listed vehicle"}
          fill
          className="object-contain p-4"
        />
      </div>

      <div className="p-4">
        {/* Card title, probably want to put some sort of id 
            or vehicle model here */}
        <h3 className="text-lg font-semibold text-center mb-2">{model}</h3>

        {/* Divs for distance and price fields */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          {/* Put location/distance here */}
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{distance} miles away</span>
          </div>

          {/* Put price here */}
          <div className="text-green-600 font-semibold">
            {Array.from({ length: 3 }).map((_, j) => (
              <span
                key={j}
                className={`text-lg leading-none ${
                  // may want to adjust the thresholds here,
                  // currently cheapest is (0-5], mid (5-10], expensive >= 10
                  pricePerHour > 5 * j
                    ? "text-waxwingLightGreen"
                    : "text-gray-300"
                }`}
              >
                $
              </span>
            ))}
            <span className="text-gray-700 ml-1">{pricePerHour} / hour</span>
          </div>
        </div>

        {/* Seller and seller rating */}
        <div className="flex justify-between items-center mb-4">
          {/* Display seller name */}
          <div className="flex items-center text-sm text-gray-700 space-x-1">
            <User size={14} />
            <span>{seller}</span>
          </div>
          {/* Display seller rating as stars */}
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <span
                key={j}
                className={`text-lg leading-none ${
                  j < rating ? "text-waxwingLightGreen" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Message and Book buttons, add functionality to them later */}
        <div className="flex justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMessageForm();
            }}
            className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition cursor-pointer"
          >
            Message Seller
          </button>

          {showMessageForm && (
            <MessageSellerForm
              seller={seller}
              title={model}
              onSend={(message) => {
                onMessageSeller(message);
                // temporary alert to simulate message sending
                alert("Message sent to seller!");
                handleCloseMessageForm();
              }}
              onBack={handleCloseMessageForm}
            />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenBookModal();
            }}
            className="px-4 py-1 text-sm bg-waxwingGreen text-white rounded-md hover:bg-waxwingLightGreen transition cursor-pointer"
          >
            Book
          </button>

          {showBookModal && (
            <BookingModal
              show={showBookModal}
              onClose={handleCloseBookModal}
              listingID={id}
              title={model}
              price={pricePerHour}
              description={description}
              seller={seller}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
