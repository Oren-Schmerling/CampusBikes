"use client";

import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { MapPinned } from "lucide-react";
import MapPopup from "./mapPopup";

/* 
Note: leaflet.js is a library for making interactive maps, 
specifically things like creating markers, zooming, panning, etc
Leaflet does not provide a map tile, which is what openstreetmap is for
*/

const MapCard = ({ bikes, openCreationModal, selectBike, selectedBike }) => {
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

        // ✅ Ask for the user’s current location
        map.locate({ setView: true, maxZoom: 17, watch: false });

        // ✅ When location is found
        function onLocationFound(e) {
          const userLatLng = e.latlng;

          localStorage.setItem(
            "userLocation",
            JSON.stringify({
              lat: userLatLng.lat,
              lng: userLatLng.lng,
              timestamp: Date.now(),
            })
          );

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

        // ✅ Handle permission denied or error
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
  }, []);

  // Update markers when bikes data changes
  useEffect(() => {
    // if map is not loaded or there are issues with leaflet then skip
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;

    // Clear existing markers to update
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    console.log(bikes);
    bikes.forEach((bike) => {
      // Create custom icon (may want ot change this later)
      var bikeIcon;
      if (bike.id === selectedBike) {
        bikeIcon = window.L.divIcon({
          className: "custom-bike-marker hover:cursor-pointer",
          html: `<div data-bike-id=${bike.id} style="background-color: #2c4a1f; width:40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 3px 12px rgba(0,0,0,0.3);"></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
      } else {
        bikeIcon = window.L.divIcon({
          className: "custom-bike-marker hover:cursor-pointer",
          html: `<div data-bike-id=${bike.id} style="background-color: #6aa84f; width:32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
      }

      // haven't done too much research, but leaflet needs lat long pair, might cause issues if we are storing addresses
      const marker = window.L.marker([bike.lat, bike.lng], {
        icon: bikeIcon,
      }).addTo(mapInstanceRef.current);
      markersRef.current.push(marker);

      // Add click handler
      marker.on("click", () => {
        selectBike(bike.id);
      });
    });
  }, [bikes, isMapLoaded, selectBike, selectedBike]);

  return (
    <div className="h-full bg-white shadow-lg overflow-hidden flex flex-col">
      {/* Map Header */}
      {/*<div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Bikes on the Map
          </h1>
        </div>
        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
          <MapPinned className="w-8 h-8 text-red-500" />
        </div>
      </div>*/}

      {/* Map Container */}
      <div className="flex-1 relative">
        <button
          onClick={openCreationModal}
          className="fixed absolute px-6 py-2 top-24 right-12 z-40 text-xl bg-waxwingGreen text-white rounded-xl hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors disabled:opacity-70"
        >
          Create Listing
        </button>{" "}
        <div ref={mapRef} className="fixed w-full h-full pb-12" />
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

export default MapCard;
