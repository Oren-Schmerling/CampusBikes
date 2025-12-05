'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/profile/profileCard';
import PropertyBox from '@/components/profile/propertyBox';
import RentalItem from '@/components/profile/rentalItem';
import ListingItem from '@/components/profile/listingItem';

const AccountPage = () => {

    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const [listingItems, setListingItems] = useState([]);
    const [rentalItems, setRentalItems] = useState([]);

    const mockListingItems = [
        {
            id: 1,
            description: "Brand new electric scooter, perfect for campus commuting",
            distance: 0.5,
            imageSrc: "/scooter.jpg",
            latitude: 42.387,
            location: "Baker Hall",
            longitude: -72.5289,
            model: "Segway Ninebot",
            pricePerHour: 10,
            rating: 5,
            seller: "john_doe",
            title: "Electric Scooter"
        },
        {
            id: 2,
            description: "Well-maintained mountain bike, great for trails",
            distance: 1.2,
            imageSrc: "/bike.jpg",
            latitude: 42.390,
            location: "Southwest Dorms",
            longitude: -72.5310,
            model: "Trek Marlin 7",
            pricePerHour: 8,
            rating: 4,
            seller: "bike_lover",
            title: "Mountain Bike"
        },
        {
            id: 3,
            description: "Comfortable cruiser bike for leisurely rides around campus",
            distance: 0.8,
            imageSrc: "/bike.jpg",
            latitude: 42.385,
            location: "Library",
            longitude: -72.5295,
            model: "Schwinn Cruiser",
            pricePerHour: 6,
            rating: 5,
            seller: "jane_smith",
            title: "Beach Cruiser"
        },
        {
            id: 4,
            description: "Fast road bike for experienced riders",
            distance: 2.1,
            imageSrc: "/bike.jpg",
            latitude: 42.392,
            location: "Engineering Building",
            longitude: -72.5320,
            model: "Giant TCR",
            pricePerHour: 12,
            rating: 4,
            seller: "speed_demon",
            title: "Road Bike"
        }
    ];

    const fetchUserInfo = async (token) => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/user/getinfo", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setUserInfo(data.user)
        } catch (error) {
            console.error('Error fetching bikes:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Only run auth check once router is ready
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
            console.log('No token found, redirecting to /');
            router.replace('/');
        } else {
            console.log('Token found');
            fetchUserInfo(token);
        }

        setCheckingAuth(false);
    }, [router]);

    const handleEdit = () => {
        console.log('Edit clicked');
        // backend endpoint to change user information
    };

    const handleDelete = () => {
        console.log('Delete clicked');
        // backend endpoint to delete user
    };

    // While checking for token, don't render anything
    if (checkingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-600">Checking authentication...</div>
            </div>
        );
    }

    // Wait for user information to load
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-600">Loading ...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <ProfileCard
                username={userInfo.username}
                phoneNumber={userInfo.phone}
                email={userInfo.email}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <div className="grid grid-cols-2 gap-16 mt-8">
                <PropertyBox name="My Listings">
                    {mockListingItems.map(item => (
                        <ListingItem key={item.id} item={item} />
                    ))}
                </PropertyBox>

                <PropertyBox name="My Rentals">
                    {rentalItems.map(item => (
                        <RentalItem key={item.id} item={item} />
                    ))}
                </PropertyBox>
            </div>
        </div>
    );
}

export default AccountPage;