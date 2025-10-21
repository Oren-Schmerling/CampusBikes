'use client';

import React, { useState, useEffect } from 'react';
import MapCard from '@/components/home/map';

const HomePage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bike locations from backend
  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      
      // put 
      // const response = await fetch('http://localhost:8080/');
      // const data = await response.json();
      
      // Mock data for demo
      const mockBikes = [
        // { id: 1, lat: 42.3732, lng: -72.5199, available: true },
        // { id: 2, lat: 42.3782, lng: -72.5249, available: true },
        // { id: 3, lat: 42.3682, lng: -72.5149, available: false },
        // { id: 4, lat: 42.3650, lng: -72.5100, available: true },
        // { id: 5, lat: 42.3550, lng: -72.5300, available: true },
        // { id: 6, lat: 42.3800, lng: -72.5100, available: true },
      ];
      
      setBikes(mockBikes);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBikeClick = (bike) => {
    console.log('Bike clicked:', bike);
    // Handle bike selection
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 p-4">
        {loading ? (
          <div className="h-full bg-white rounded-3xl shadow-lg flex items-center justify-center">
            <div className="text-gray-600">Loading bikes...</div>
          </div>
        ) : (
          <MapCard bikes={bikes} onBikeClick={handleBikeClick} />
        )}
      </div>

      <div className="w-1/2 p-4 flex flex-col gap-4">
        <button>
            Find Bike listings
        </button>
        
        <button>
            Rent out bike
        </button>

      </div>
    </div>
  );
};

export default HomePage;