"use client";

import React, { useState, useEffect, useRef } from "react";
import ListingCard from "@/components/listings/listingCard";
import MapCard from "@/components/home/map";
import { useRouter } from "next/navigation";
import { CreateListingModal } from "@/components/listings/createListingModal";
import haversineDistanceMiles from "@/components/listings/haversineDistance";
import { handleMessageSeller, handleBook } from "../listings/util";

const HomePage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [selectedListing, setSelectedListingSlave] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const url = `${BASE_URL}/auth/verify`;
  const [loggedIn, setLoggedIn] = useState(null);

  const scrollToCard = (id) => {
    const cardElement = document.getElementById(id);
    cardElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const setSelectedListing = (listing) => {
    setSelectedListingSlave(listing);
    scrollToCard(listing);
  };

  useEffect(() => {
    const init = async () => {
      // Get user location
      let loc = null;
      const saved = localStorage.getItem("userLocation");

      if (saved) {
        loc = JSON.parse(saved);
      } else {
        loc = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const newLoc = { lat: latitude, lng: longitude };
              localStorage.setItem("userLocation", JSON.stringify(newLoc));
              resolve(newLoc);
            },
            (err) => reject(err)
          );
        }).catch((err) => {
          console.warn("Geolocation error:", err);
          alert("We need your location to filter by distance.");
          return null;
        });
      }
      setUserLocation(loc);

      // Auth check

      const checkAuth = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoggedIn(false);
          return;
        }
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            setLoggedIn(false);
            return;
          }
          const data = await res.json();
          console.log(`home page found token with status: ${data.valid}`);
          setLoggedIn(data.valid); // true or false
        } catch (err) {
          console.error("Auth verification error:", err);
          setLoggedIn(false);
        }
      };
      checkAuth();
      setCheckingAuth(false);

      // Fetch bikes using location
      await fetchBikes(loc);
    };

    init();
  }, [url]);

  const fetchBikes = async (loc) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/listing/bikes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      // Map backend 'bikes' array to frontend-friendly structure
      const mappedListings = (data.bikes || [])
        .map((item) => ({
          id: item.id,
          lat: item.latitude,
          lng: item.longitude,
          available: item.status,
          imageSrc:
            item.imageUrl ||
            (item.title === "Bike" ? "/bike.jpg" : "/scooter.jpg"),
          model: item.model || item.title,
          distance: loc
            ? haversineDistanceMiles(
                loc.lat,
                loc.lng,
                item.latitude,
                item.longitude
              )
            : null,
          pricePerHour: item.pricePerHour || 0,
          seller: item.seller || "Unknown",
          rating: item.rating || Math.floor(Math.random() * 5) + 1, //@todo: make this actually pull rating
        }))
        .sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });

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
    <div className="flex h-fit bg-gray-50 overflow-hidden">
      <div className="w-[360px] flex flex-col p-2 pt-2">
        {createModalIsOpen && (
          <CreateListingModal
            setIsOpen={setCreateModalIsOpen}
            handler={fetchBikes}
          />
        )}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {bikes.map((listing) => {
            if (listing.id === selectedListing) {
            }

            return (
              <ListingCard
                key={listing.id}
                imageSrc={listing.imageSrc}
                model={listing.model}
                distance={listing.distance ? listing.distance.toFixed(2) : null}
                pricePerHour={listing.pricePerHour}
                seller={listing.seller}
                rating={listing.rating}
                id={listing.id}
                onMessageSeller={handleMessageSeller}
                onBook={handleBook}
                onClick={() => setSelectedListing(listing.id)}
                selectedListing={selectedListing}
                bike={listing.id}
              />
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-1">
        <div className="w-full h-full bg-white rounded-3xl shadow-lg">
          {loading ? (
            <div className="h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
              <div className="text-gray-600">Loading bikes...</div>
            </div>
          ) : (
            <MapCard
              bikes={bikes}
              openCreationModal={() => setCreateModalIsOpen(true)}
              selectBike={(s) => setSelectedListing(s)}
              selectedBike={selectedListing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
