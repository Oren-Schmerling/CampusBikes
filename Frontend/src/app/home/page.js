"use client";

import React, { useState, useEffect } from "react";
import ListingCard from "@/components/listings/listingCard";
import MapCard from "@/components/home/map";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bike, ChevronRight } from "lucide-react";

const HomePage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run auth check once router is ready
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log("Checking auth token in HomePage useEffect", token);
    if (!token) {
      console.log("No token found, redirecting to /");
      router.replace("/");
    } else {
      console.log("Token found ✅");
      fetchBikes();
    }

    setCheckingAuth(false);
  }, [router]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/listing/bikes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      // Map backend 'bikes' array to frontend-friendly structure
      const mappedListings = (data.bikes || []).map((item) => ({
        id: item.id,
        lat: item.latitude,
        lng: item.longitude,
        available: item.status,
        // imageSrc:
        //   item.imageUrl ||
        //   (item.title === "Bike" ? "/bike.jpg" : "/scooter.jpg"),
        // model: item.model || item.title,
        // distance: item.distance || 0,
        // pricePerHour: item.pricePerHour || 0,
        // seller: item.seller || "Unknown",
        // rating: item.rating || Math.floor(Math.random() * 5) + 1,
      }));

      const filteredListings = mappedListings.filter(
        (bike) => bike.available === "available"
      );

      setBikes(filteredListings);
    } catch (err) {
      console.error("Error fetching bikes:", err);
    } finally {
      setLoading(false);
    }
  };

  // While checking for token, don't render anything
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-white rounded-3xl shadow-lg">
          {loading ? (
            <div className="h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
              <div className="text-gray-600">Loading bikes...</div>
            </div>
          ) : (
            <MapCard bikes={bikes} onBikeClick={(bike) => console.log(bike)} />
          )}
        </div>
      </div>

      <div className="w-[450px] p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {bikes.map((listing) => (
            <ListingCard
              key={listing.id}
              imageSrc={listing.imageSrc}
              model={listing.model}
              distance={listing.distance ? listing.distance.toFixed(2) : null}
              pricePerHour={listing.pricePerHour}
              seller={listing.seller}
              rating={listing.rating}
              // onMessageSeller={handleMessageSeller}
              // onBook={handleBook}
              onClick={() => setSelectedListing(listing)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
