"use client";

import ListingCard from "@/components/listings/listingCard";
import SearchBar from "@/components/listings/searchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon, Star } from "lucide-react";
import { createListing } from "@/api/createListing";
import MapDropLocation from "@/components/listings/mapDropLocation";

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
  setDistance
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
  const handleDistance = (value) => {
    setDistance(value);
  };

  return (
    <div className="w-64 h-full bg-lighterGray">
      <div className="w-full h-6 text-center justify-center text-xl py-2 pb-32">
        Filters
      </div>
      <div className="space-y-2 pb-8">
        <div className="w-full h-6 text-center justify-center text-lg">
          Type
        </div>
        <label className="flex items-center justify-start space-x-4 w-full pl-4">
          <input
            type="checkbox"
            checked={showBikes}
            onChange={handleBikeChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-center">Bikes</span>
        </label>
        <label className="flex items-center justify-start space-x-4 w-full pl-4">
          <input
            type="checkbox"
            checked={showScooters}
            onChange={handleScooterChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-center">Scooters</span>
        </label>
      </div>

      <div className="space-y-2 pb-8 w-full">
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

      <div className="space-y-2 pb-8 w-full">
        <div className="text-center text-lg font-medium">Distance</div>
        <div className="flex flex-col items-center w-full space-y-2">
          <input
            type="range"
            min="0"
            max="5"
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
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              fill={rating >= star ? "var(--color-waxwingGreen)" : "none"}
              stroke="currentColor"
              className={`w-8 h-8 cursor-pointer ${
                rating >= star
                  ? "text-[var(--color-waxwingGreen)]"
                  : "text-gray-300"
              }`}
              onClick={() => handleStars(star)}
            />
          ))}
        </div>
        <span className="text-center text-lg">
          {rating > 0
            ? `${rating} star${rating > 1 ? "s" : ""}+`
            : "Any rating"}
        </span>
      </div>
    </div>
  );
}

//Could be a compnent and modified to be reusable
function CreateListingModal({ setIsOpen, setListings }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    latitude: "42.3870",
    longitude: "-72.5289",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      pricePerHour: parseFloat(formData.price),
      location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };
    console.log(payload);
    const result = await createListing(payload);
    console.log("Create response", { result });
    setIsOpen(false);
    fetchListings(setListings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative bg-gray-100 rounded-2xl p-10 w-full max-w-5xl shadow-2xl z-10">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-nearBlack transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-nearBlack mb-8 text-center">
          Create Listing
        </h2>

        {/* Layout split */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full md:w-1/2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter listing title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your listing"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Hour ($)
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="City, State"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-waxwingGreen text-white py-3 rounded-lg font-medium hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors"
              >
                Create Listing
              </button>
            </div>
          </form>

          {/* Right: Map */}
          <div className="w-full md:w-1/2 h-[400px]">
            <MapDropLocation
              onPositionChange={(pos) => {
                console.log("Selected position:", pos);
                formData.latitude = pos.lat;
                formData.longitude = pos.lng;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchListings(setListings) {
  try {
    const res = await fetch("http://localhost:8080/listing/bikes");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // Map backend 'bikes' array to frontend-friendly structure
    const mappedListings = (data.bikes || []).map((item) => ({
      id: item.id,
      imageSrc:
        item.imageUrl || (item.title === "Bike" ? "/bike.jpg" : "/scooter.jpg"),
      model: item.model || item.title,
      latitude: item.latitude,
      longitude: item.longitude,
      distance: NaN,
      pricePerHour: item.pricePerHour || 0,
      seller: item.seller || "Unknown",
      rating: item.rating || Math.floor(Math.random() * 5) + 1,
    }));

    setListings(mappedListings);
  } catch (err) {
    console.error("Error fetching listings:", err);
  }
}

function haversineDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
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

  const [userLocation, setUserLocation] = useState(null);

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
  .map(item => {
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
  .filter(item => {
    if (item.model === "Bike" && !showBikes) return false;
    if (item.model === "Scooter" && !showScooters) return false;
    if (item.pricePerHour > price) return false;
    if (item.rating < rating) return false;
    if (userLocation && item.distance != null && item.distance > maxDistance) return false;
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
          setListings={setListings}
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
                  distance={listing.distance ? listing.distance.toFixed(2) : null}
                  pricePerHour={listing.pricePerHour}
                  seller={listing.seller}
                  rating={listing.rating}
                  onMessageSeller={handleMessageSeller}
                  onBook={handleBook}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
