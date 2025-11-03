"use client";

import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { MapPinned } from "lucide-react";

const MapCard = ({ lat, long }) => {
  const mapRef = useRef(null); // reference to the div for the map's rendering
  const mapInstanceRef = useRef(null); // reference to the map's instance/the leaflet map object
  const markersRef = useRef([]); // reference to the markers displayed on the map (should be the bikes eventually)
  const [isMapLoaded, setIsMapLoaded] = useState(false); // state to track whether the map is loaded

  // Initialize map
  useEffect(() => {
    // Load Leaflet CSS and JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"; // get styling for leaflet
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"; // leaflet js script
    script.onload = () => {
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Initialize map at UMass as fallback
        const map = window.L.map(mapRef.current).setView(
          [42.387, -72.5289],
          15
        );

        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 22,
          }
        ).addTo(map);

        // Ask for the user’s current location
        map.locate({ setView: true, maxZoom: 17, watch: false });

        // When location is found
        function onLocationFound(e) {
          const userLatLng = e.latlng;

            localStorage.setItem("userLocation", JSON.stringify({
              lat: userLatLng.lat,
              lng: userLatLng.lng,
              timestamp: Date.now(),
            }));

          // Create a small green dot marker
          const userIcon = window.L.divIcon({
            className: "custom-user-marker",
            html: `<div style="
              background-color: #22c55e; /* green */
              width: 14px; 
              height: 14px; 
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 6px rgba(0,0,0,0.3);
              "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          // Add the green marker to the map
          window.L.marker(userLatLng, { icon: userIcon })
            .addTo(map)
            .bindPopup("Your current location")
            .openPopup();
        }

        // Handle permission denied or error
        function onLocationError(e) {
          console.warn("Unable to retrieve location:", e.message);
          // Keep default view on UMass
          map.setView([42.387, -72.5289], 15);
        }

        map.on("locationfound", onLocationFound);
        map.on("locationerror", onLocationError);

        mapInstanceRef.current = map;
        setIsMapLoaded(true);
      }
    };

    // append the map to the DOM
    document.body.appendChild(script);

    // cleanup function, should be ran when the component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Don't remove the Leaflet script and CSS as they might be needed by other instances
    };
  }, []);

  // Update markers when bikes data changes
  useEffect(() => {
    // if map is not loaded or there are issues with leaflet then skip
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;

    // Clear existing markers to update
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create custom icon (may want ot change this later)
    const bikeIcon = window.L.divIcon({
      className: "custom-bike-marker",
      html: `<div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // // Add new markers
    // haven't done too much research, but leaflet needs lat long pair, might cause issues if we are storing addresses
    const marker = window.L.marker([lat, long], {
    icon: bikeIcon,
    }).addTo(mapInstanceRef.current);

    // might want to add functionality here to book a bike here?
    // create a div container for the marker popup

    // Create a React root and render the marker component

    // update current markers
    markersRef.current.push(marker);
  }, [isMapLoaded]);

  return (
    <div className="h-full bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {/* Have loading map display if map is still rendering */}
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-gray-600">Loading map...</div>
          </div>
        )}
      </div>
    </div>
  );
};

const ListingDetailModal = ({listing}) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{listing.model}</h2>

            <h3 className="text-waxwingGreen font-bold">Title</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">{listing.title}</p>
            </div>

            <h3 className="text-waxwingGreen font-bold">Description</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">{listing.description}</p>
            </div>

            <h3 className="text-waxwingGreen font-bold">Location</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">{listing.location}</p>
            </div>

            <h3 className="text-waxwingGreen font-bold">Price</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">${listing.pricePerHour}/hour</p>
            </div>

            <h3 className="text-waxwingGreen font-bold">Distance</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">{listing.distance}</p>
            </div>

            <h3 className="text-waxwingGreen font-bold">Seller</h3>
            <div className="max-h-[150px] overflow-y-auto rounded-md p-3 border border-gray-200 mb-2">
                <p className="text-gray-700 pr-2">{listing.seller}</p>
            </div>

            <div className="h-[200px] w-full mt-4">
                <MapCard lat={listing.latitude} long={listing.longitude}/>
            </div>
        </div>
    );
}

export default ListingDetailModal;