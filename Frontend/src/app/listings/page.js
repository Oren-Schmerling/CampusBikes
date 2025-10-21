"use client";

import ListingCard from "@/components/listings/listingCard";
import SearchBar from "@/components/listings/searchBar";
import { useEffect, useState } from "react";
import { LucideIcon, Star } from "lucide-react";

// this may eventually be complex enough to be pulled into its own component file
function LeftBar() {
  const [price, setPrice] = useState(25);
  const [showBikes, setShowBikes] = useState(true);
  const [showScooters, setShowScooters] = useState(true);
  const [rating, setRating] = useState(0);

  const handleBikeChange = () => {setShowBikes(!showBikes)};
  const handleScooterChange = () => {setShowScooters(!showScooters)};
  const handleStars = (value) => {setRating(value)};
  
  return (
    <div className="w-64 h-full bg-lighterGray">
      <div className="w-full h-6 text-center justify-center text-xl py-2 pb-32">
        Filters
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Type
        </div>
          <label className="flex items-center justify-start space-x-4 w-full pl-4">
            <input
              type="checkbox"
              checked={showScooters}
              onChange={handleScooterChange}
              className="accent-[var(--color-waxwingGreen)] w-6 h-6"
            />
            <span className="text-lg flex-1">
              Bikes
            </span>
          </label>
          <label className="flex items-center justify-start space-x-4 w-full pl-4">
            <input
              type="checkbox"
              checked={showBikes}
              onChange={handleBikeChange}
              className="accent-[var(--color-waxwingGreen)] w-6 h-6"
            />
            <span className="text-lg flex-1">
              Scooters
            </span>
          </label>
        </div>
    <div className="space-y-4 pb-32 w-full">
      <div className="text-center text-lg font-medium">Hourly Price</div>
      <div className="flex flex-col items-center w-full space-y-2">
        <input
          type="range"
          min="0"
          max="25"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-3/4 h-2 accent-[var(--color-waxwingGreen)] rounded-lg"
        />
        <div className="flex justify-mid text-sm font-semibold text-gray-700">
          <span>${price}</span>
        </div>
    </div>
    </div>
    <div className="space-y-2 w-full flex flex-col items-center">
      {/* Stars */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            fill={rating >= star ? "var(--color-waxwingGreen)" : "none"}
            stroke="currentColor"
            className={`w-8 h-8 cursor-pointer ${
              rating >= star ? "text-[var(--color-waxwingGreen)]" : "text-gray-300"
            }`}
            onClick={() => handleStars(star)}
          />
        ))}
      </div>
      <span className="text-center text-lg">
        {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}+` : "Any rating"}
      </span>
    </div>
    </div>
  );
}

export default function ListingsPage() {

  // state variables
  const [bikes, setBikes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // add this just in case we want to access search query later

  useEffect(() => {
    // function to fetch bikes from backend endpoint
    async function fetchBikes() {
      try {
        // put proper backend bikes endpoint here
        const res = await fetch("http://localhost:8080/listing/bikes");
        const data = await res.json();
        setBikes(data);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    }

    fetchBikes();
  }, []);


  // function to handle search bar submissions
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      // console.log("fetching search results for:", query); // console log for debugging
      // put proper backend search endpoint here, may need some filtering before sending query
      const res = await fetch(`http://localhost:8080/listing/bikes?search=${query}`);
      const data = await res.json();
      setBikes(data);
    } catch (err) {
      console.error("Error searching:", err);
    }
  };

  /*
  function to handle messaging seller, used when Message Seller button on a card is clicked
  Still needs to be defined with proper parameters and backend endpoint
  */
  const handleMessageSeller = async () => {
    try {
      // console.log("messaging seller"); // debug log
      const res = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify()
      });
    } catch (err) {
      console.error('Error messaging seller:', err);
    }
  };

  /*
  function to handle booking a listing, used when the book button on a card is clicked
  Still needs to be defined with proper parameters and backend endpoint
  */
  const handleBook = async () => {
    // console.log("booking listing"); // debug log
    try {
      const res = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify()
      });
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

return (
    <div className="flex h-screen bg-white">      
      {/* Filter sidebar */}
      <LeftBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar, fixed at top */}
        <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200 flex justify-center">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for listings..."
          />
        </div>

        {/* Listing cards area, 
          is scrollable, but scroll bar is not visible, may want to change later
        */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {/* Render listing cards here based on fetched bikes,
              need to figure out proper fields to pass in based on backend data
              */}
              {/* {bikes.length === 0 ? (
                <p className="text-gray-500">Loading listings...</p>
              ) : (
                bikes.map((bike) => (
                  <ListingCard
                    key={bike.id}
                    imageSrc={bike.imageUrl}
                    model={bike.model}
                    distance={bike.distance}
                    pricePerHour={bike.pricePerHour}
                    seller={bike.seller}
                    rating={bike.rating}
                    onMessageSeller={handleMessageSeller}
                    onBook={handleBook}
                  />
                ))
              )} */}

              {/* Temporary hardcoded listing cards for layout testing */}
              <ListingCard
                key={1}
                imageSrc="/bike.jpg"
                model="Bike"
                distance={2.5}
                pricePerHour={15}
                seller="JohnDoe123"
                rating={4}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={2}
                imageSrc="/scooter.jpg"
                model="Scooter"
                distance={1.2}
                pricePerHour={1}
                seller="JaneSmith456"
                rating={5}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={3}
                imageSrc="/bike.jpg"
                model="Bike"
                distance={0.8}
                pricePerHour={8}
                seller="MikeBlue789"
                rating={3}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={4}
                imageSrc="/scooter.jpg"
                model="Scooter"
                distance={3.4}
                pricePerHour={12}
                seller="AliceGreen321"
                rating={4}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={5}
                imageSrc="/bike.jpg"
                model="Bike"
                distance={2.0}
                pricePerHour={5}
                seller="BobWhite654"
                rating={2}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              /> 
              <ListingCard
                key={6}
                imageSrc="/scooter.jpg"
                model="Scooter"
                distance={4.1}
                pricePerHour={20}
                seller="CharlieBrown987"
                rating={5}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={7}
                imageSrc="/bike.jpg"
                model="Bike"
                distance={1.5}
                pricePerHour={7}
                seller="DianaYellow159"
                rating={4}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />
              <ListingCard
                key={8}
                imageSrc="/scooter.jpg"
                model="Scooter"
                distance={2.8}
                pricePerHour={3}
                seller="EthanPurple753"
                rating={3}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
              />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
