'use client';

import React, { useState, useEffect } from 'react';
import MapCard from '@/components/home/map';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bike, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // to route to listing page

  // Fetch bike locations from backend
  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      
      // const response = await fetch('http://localhost:8080/');
      // const data = await response.json();
      
      // Mock data for demo
      const mockBikes = [
        { id: 1, lat: 42.3870, lng: -72.5270, available: true },
        { id: 2, lat: 42.3900, lng: -72.5250, available: true },
        { id: 3, lat: 42.3790, lng: -72.5300, available: false },
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
    // Handle bike selection, implement later
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
        {/* Find listings card */}
        <button
          onClick={() => router.push('/listings')}
          className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="h-full flex flex-col relative">
            <div className="px-6 py-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Find Bike Listings</h2>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative w-full h-64 flex items-center justify-center">
                  <Image
                    src="/HomePageImg.png"
                    alt="Rent a bike picture"
                    fill
                  />
              </div>
            </div>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </button>
        
        {/* 
        Rent your bike card 
        Need to figure out where this will go, form, separate page, etc
        Might want to update later to match figma more, just placeholder text and icon for now
        */}
        <button
          className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="h-full flex items-center justify-between px-8">
            <h2 className="text-5xl font-bold text-gray-900">Rent Out Your Bike</h2>
            <Bike size={150} className=''/>
          </div>
        </button>

      </div>
    </div>
  );
};

export default HomePage;