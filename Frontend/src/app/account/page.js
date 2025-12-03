'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/profile/profileCard';
import PropertyBox from '@/components/profile/propertyBox';

const AccountPage = () => {

    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            // grab data from backend api

            // const res = await fetch("http://localhost:8080/listing/bikes");
            // const data = await res.json();
            // setUserInfo(data)
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
            fetchUserInfo();
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
                username="User_xx" // {userInfo.username}
                phoneNumber="999-999-999" // {userInfo.phone}
                email="umass@umass.edu" // {userInfo.email}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="grid grid-cols-2 gap-16 mt-8">
                <PropertyBox
                    name="Listings"
                />
                <PropertyBox
                    name="Rentals"
                />
            </div>
        </div>
    );
}

export default AccountPage;