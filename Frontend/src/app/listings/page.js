"use client";

import ListingCard from "@/components/nav/listings/listingCard";
import { useEffect, useState } from "react";

// this may eventually be complex enough to be its own component file
function LeftBar() {
  return (
    <div className="w-64 h-full bg-lighterGray">
      <div className="w-full h-6 text-center justify-center text-xl py-2 pb-32">
        Filters
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Type
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for bikes
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for scooters
        </div>
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Price
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for price slider
        </div>
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Minimum Seller Rating
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for Star Selector
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {

  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    // Fetch bikes from backend endpoint
    async function fetchBikes() {
      try {
        // put proper backend bikes endpoint here
        const res = await fetch("http://localhost:8080/listing/bikes");
        const data = await res.json();
        setBikes(data);
      } catch (err) {
        console.error("Error fetching bikes:", err);
      }
    }

    fetchBikes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">      
      {/* Left sidebar */}
      <LeftBar />

      {/* Listing cards area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 flex justify-center border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {/* Example listing cards, replace with dynamic data later 
              Need to implement scroll bar
            */}
            <ListingCard
              imageSrc="/bike.jpg"
              model="Bike"
              distance={2.5}
              pricePerHour={15}
              seller="JohnDoe123"
              rating={4}
            />
            <ListingCard
              imageSrc="/scooter.jpg"
              model="Scooter"
              distance={1.2}
              pricePerHour={1}
              seller="JaneSmith456"
              rating={5}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
