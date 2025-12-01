"use client";

import FilterSidebar from "@/components/listings/filterSidebar";
import haversineDistanceMiles from "@/components/listings/haversineDistance";
import ListingCard from "@/components/listings/listingCard";
import SearchBar from "@/components/listings/searchBar";
import ListingDetailModal from "@/components/listings/listingDetailModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MapDropLocation from "@/components/listings/mapDropLocation";
import BookingModal from "@/components/listings/bookingModal";
import { CreateListingModal } from "@/components/listings/createListingModal";
import { fetchListings } from "@/api/fetchListings";
import { handleMessageSeller, handleBook } from "./util";

export default function ListingsPage() {
  const [price, setPrice] = useState(25);
  const [showBikes, setShowBikes] = useState(true);
  const [showScooters, setShowScooters] = useState(true);
  const [rating, setRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleOpenBookingModal = () => {
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  // state variables
  const [bikes, setBikes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // add this just in case we want to access search query later

  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings(setListings);
    console.log("Fetched listings:", filtered); // debug log
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      setUserLocation(JSON.parse(saved));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          localStorage.setItem("userLocation", JSON.stringify(loc));
          setUserLocation(loc);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          alert("We need your location to filter by distance.");
        }
      );
    }
  }, []);

  const filtered = listings
    .map((item) => {
      if (!userLocation) return { ...item, distance: null };
      return {
        ...item,
        distance: haversineDistanceMiles(
          userLocation.lat,
          userLocation.lng,
          item.latitude,
          item.longitude
        ),
      };
    })
    .filter((item) => {
      if (item.model === "Bike" && !showBikes) return false;
      if (item.model === "Scooter" && !showScooters) return false;
      if (item.pricePerHour > price) return false;
      if (item.rating < rating) return false;
      if (userLocation && item.distance != null && item.distance > maxDistance)
        return false;
      return true;
    });

  // function to handle search bar submissions
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      // console.log("fetching search results for:", query); // console log for debugging
      // put proper backend search endpoint here, may need some filtering before sending query
      const res = await fetch(
        `http://localhost:8080/listing/bikes?search=${query}`
      );
      const data = await res.json();
      setBikes(data);
    } catch (err) {
      console.error("Error searching:", err);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {createModalIsOpen && (
        <CreateListingModal
          setIsOpen={setCreateModalIsOpen}
          handler={() => fetchListings(setListings)}
        />
      )}
      <FilterSidebar
        showBikes={showBikes}
        setShowBikes={setShowBikes}
        showScooters={showScooters}
        setShowScooters={setShowScooters}
        price={price}
        setPrice={setPrice}
        rating={rating}
        setRating={setRating}
        distance={maxDistance}
        setDistance={setMaxDistance}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar, fixed at top */}
        <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200 flex justify-center gap-x-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for listings..."
          />
          <button
            onClick={() => setCreateModalIsOpen(true)}
            className="px-4 py-1 text-sm bg-waxwingGreen text-white rounded-lg hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors disabled:opacity-70"
          >
            Create Listing
          </button>
        </div>

        {/* Listing cards area, 
          is scrollable, but scroll bar is not visible, may want to change later
        */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 justify-items-center">
              {/* Render listing cards here based on fetched bikes,
              need to figure out proper fields to pass in based on backend data
              */}
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  imageSrc={listing.imageSrc}
                  model={listing.model}
                  distance={
                    listing.distance ? listing.distance.toFixed(2) : null
                  }
                  pricePerHour={listing.pricePerHour}
                  seller={listing.seller}
                  rating={listing.rating}
                  description={listing.description}
                  onMessageSeller={handleMessageSeller}
                  onBook={handleBook}
                  onClick={() => {
                    console.log("Selected listing:", listing);
                    setSelectedListing(listing);
                  }}
                  id={listing.id}
                />
              ))}
            </div>
            {selectedListing && (
              <div
                onClick={() => setSelectedListing(null)} // click background to close
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
                  className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] shadow-lg overflow-y-auto"
                >
                  <ListingDetailModal listing={selectedListing} />

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleOpenBookingModal();
                      }}
                      className="flex-1 py-3 bg-waxwingGreen text-white rounded-lg font-medium hover:bg-waxwingLightGreen transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Book
                    </button>

                    {showBookingModal && (
                      <BookingModal
                        show={showBookingModal}
                        onClose={() => {
                          handleCloseBookingModal();
                          setSelectedListing(null);
                        }}
                        listingID={selectedListing.id}
                        title={selectedListing.model}
                        price={selectedListing.pricePerHour}
                        description={selectedListing.description}
                        seller={selectedListing.seller}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
