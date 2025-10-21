import Image from "next/image";

/*
Package for icons used in the listing card component
currently using MapPin and User icons from lucide-react
can change packages if needed

run npm install lucide-react in the frontend folder if not installed
*/
import { MapPin, User } from "lucide-react";

const ListingCard = ({
  imageSrc,
  model,
  distance, // might be easier to have this be location instead of distance
  pricePerHour,
  seller,
  rating,
}) => {
  return (
    <div className="w-64 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      {/* Image area, temporary placeholder, need to format correctly for what backend returns*/}
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={imageSrc || "/bike.jpg"}
          alt={model}
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
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg leading-none ${
                  // may want to adjust the thresholds here, 
                  // currently cheapest is (0-5], mid (5-10], expensive >= 10
                  pricePerHour > 5*i ? "text-green-500" : "text-gray-300"
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
                  j < rating ? "text-green-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Message and Book buttons, add functionality to them later */}
        <div className="flex justify-between">
          <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition">
            Message Seller
          </button>
          <button className="px-4 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}


export default ListingCard;