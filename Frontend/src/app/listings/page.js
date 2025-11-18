"use client";

import ListingCard from "@/components/listings/listingCard";
import SearchBar from "@/components/listings/searchBar";
import ListingDetailModal from "@/components/listings/listingDetailModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon, Star } from "lucide-react";
import MapDropLocation from "@/components/listings/mapDropLocation";
import BookingModal from "@/components/listings/bookingModal";
import { CreateListingModal } from "@/components/listings/createListingModal";
import { fetchListings } from "@/api/fetchListings";

// this may eventually be complex enough to be pulled into its own component file
function LeftBar({
  showBikes,
  setShowBikes,
  showScooters,
  setShowScooters,
  price,
  setPrice,
  rating,
  setRating,
  distance,
  setDistance,
}) {
  const handleBikeChange = () => {
    setShowBikes(!showBikes);
  };
  const handleScooterChange = () => {
    setShowScooters(!showScooters);
  };
  const handleStars = (value) => {
    setRating(value);
  };

  return (
    <div className="w-64 h-full bg-[#8ac487]">
      <div className="w-full h-6 text-center py-2 pb-24 text-3xl font-bold text-waxwingDarkGreen">
        Filters
      </div>
      <div className="space-y-2 pb-8">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Ride Type
        </div>
        <label className="flex items-center justify-start space-x-6 w-full pl-6">
          <input
            type="checkbox"
            checked={showBikes}
            onChange={handleBikeChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-left">Bikes</span>
        </label>
        <label className="flex items-center justify-start space-x-6 w-full pl-6">
          <input
            type="checkbox"
            checked={showScooters}
            onChange={handleScooterChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-left">Scooters</span>
        </label>
      </div>

      <div className="space-y-2 pb-8 w-full">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Hourly Price
        </div>
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

      <div className="space-y-2 pb-8 w-full">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Distance
        </div>
        <div className="flex flex-col items-center w-full space-y-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-3/4 h-2 accent-[var(--color-waxwingGreen)] rounded-lg"
          />
          <div className="flex justify-center text-sm font-semibold text-gray-700">
            <span>{distance} Miles</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Rating
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              fill={rating >= star ? "var(--color-waxwingGreen)" : "#f2f2f2"}
              strokeWidth={1}
              // stroke="var(--color-waxwingGreen)"
              className={`w-8 h-8 cursor-pointer ${
                rating >= star
                  ? "text-[var(--color-waxwingGreen)]"
                  : "text-gray-300"
              }`}
              onClick={() => handleStars(star)}
            />
          ))}
        </div>
        <span className="flex justify-center text-sm font-semibold text-gray-700">
          {rating > 0
            ? `${rating} star${rating > 1 ? "s" : ""}+`
            : "Any rating"}
        </span>
      </div>
    </div>
  );
}

function haversineDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in miles
}

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

  /*
  function to handle messaging seller, used when Message Seller button on a card is clicked
  Still needs to be defined with proper parameters and backend endpoint
  */
  const handleMessageSeller = async () => {
    try {
      // console.log("messaging seller"); // debug log
      const res = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      });
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

  return (
    <div className="flex h-screen bg-white">
      {createModalIsOpen && (
        <CreateListingModal
          setIsOpen={setCreateModalIsOpen}
          handler={() => fetchListings(setListings)}
        />
      )}
      {/* Filter sidebar */}
      <LeftBar
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
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
                  onClick={() => setSelectedListing(listing)}
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

                    {/* A little goofy, because this will show up on top of the details popup, may want to change */}
                    {showBookingModal && (
                      <BookingModal
                        show={showBookingModal}
                        onClose={() => {
                          handleCloseBookingModal();
                          setSelectedListing(null);
                        }}
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
