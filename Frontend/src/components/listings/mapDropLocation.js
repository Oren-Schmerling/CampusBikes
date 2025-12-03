"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPinned } from "lucide-react";

const MapDropLocation = ({ onPositionChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState([42.387, -72.5289]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) {
        setIsMapLoaded(true);
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      script.onload = () => setIsMapLoaded(true);
      document.body.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !window.L || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = window.L.map(mapRef.current).setView(selectedPosition, 15);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 22,
    }).addTo(map);

    mapInstanceRef.current = map;

    const marker = window.L.marker(selectedPosition, {
      draggable: true,
      title: "Drag to select location",
    }).addTo(map);

    markerRef.current = marker;

    marker.on("dragend", function () {
      const pos = marker.getLatLng();
      setSelectedPosition([pos.lat, pos.lng]);
      if (onPositionChange) onPositionChange(pos);
    });

    return () => {
      if (marker) {
        marker.off("dragend");
      }
    };
  }, [isMapLoaded, onPositionChange]);

  useEffect(() => {
    if (!markerRef.current) return;

    const marker = markerRef.current;

    const handleDragEnd = () => {
      const pos = marker.getLatLng();
      setSelectedPosition([pos.lat, pos.lng]);
      if (onPositionChange) onPositionChange(pos);
    };

    marker.off("dragend");
    marker.on("dragend", handleDragEnd);

    return () => {
      marker.off("dragend", handleDragEnd);
    };
  }, [onPositionChange]);

  return (
    <div className="h-full bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Select Pick Up Location
          </h1>
        </div>
        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
          <MapPinned className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-gray-600">Loading map...</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 text-gray-700 text-sm">
        Selected Position: {selectedPosition[0].toFixed(5)},{" "}
        {selectedPosition[1].toFixed(5)}
      </div>
    </div>
  );
};

export default MapDropLocation;
