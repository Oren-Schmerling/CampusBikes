"use client";

import React, { useState, useEffect } from "react";
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
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 p-4">
        {loading ? (
          <div className="h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
            <div className="text-gray-600">Loading bikes...</div>
          </div>
        ) : (
          <MapCard bikes={bikes} onBikeClick={(bike) => console.log(bike)} />
        )}
      </div>

      <div className="w-1/2 p-4 flex flex-col gap-4">
        <button
          onClick={() => router.push("/listings")}
          className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="h-full flex flex-col relative">
            <div className="px-6 py-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                Find Bike Listings
              </h2>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative w-full h-64 flex items-center justify-center">
                <Image src="/HomePageImg.png" alt="Rent a bike picture" fill />
              </div>
            </div>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </button>

        <button className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="h-full flex items-center justify-between px-8">
            <h2 className="text-5xl font-bold text-gray-900">
              Rent Out Your Bike
            </h2>
            <Bike size={150} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
