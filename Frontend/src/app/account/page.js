'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/profile/profileCard';
import PropertyBox from '@/components/profile/propertyBox';
import RentalItem from '@/components/profile/rentalItem';
import ListingItem from '@/components/profile/listingItem';
import { EditListingModal } from "@/components/profile/editListingModal";
import { handleMessageSeller } from '../listings/util';
import { logout } from "@/api/logout";
import changeAccount from '@/api/accountChange';

const AccountPage = () => {

    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const [listingItems, setListingItems] = useState([]);
    const [rentalItems, setRentalItems] = useState([]);

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);


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

    const fetchUserListings = async () => {

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/listing/getbikesuser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setListingItems(data.bikes)
        } catch (error) {
            console.error('Error fetching bikes:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUserRentals = async (token) => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/booking/user", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            console.log(data)
            setRentalItems(data.bookings)
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
            fetchUserListings(token);
            fetchUserRentals(token)
        }

        setCheckingAuth(false);
    }, [router]);

    const handleEdit = async (updateData) => {
        const result = await changeAccount(updateData);

        // console.log("result: ", result) // debugging

        if (result.success) {
            // Check if username was changed, for now, log the user out and have them sign in again if the username was changed
            // otherwise there were errors which would crash the page
            if (updateData.username !== userInfo.username) {
                alert('Username changed successfully! Please log in again with your new username.');
                logout();
                router.replace('/');
            } else {
                // Only refresh if username wasn't changed
                const token = localStorage.getItem('authToken');
                await fetchUserInfo(token);
                console.log('Profile updated successfully');
                alert('Profile updated successfully!');
            }
        } else {
            console.log('Profile not updated successfully');
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        router.replace('/');
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
                onLogout={handleLogout}
            />
            <div className="grid grid-cols-2 gap-16 mt-8">
                <PropertyBox name="My Listings">
                    {listingItems.map(item => (
                        <ListingItem
                            key={item.id}
                            item={item}
                            onEdit={(listing) => {
                                setSelectedListing(listing);
                                setEditModalIsOpen(true);
                            }}
                        />
                    ))}
                </PropertyBox>

                <PropertyBox name="My Rentals">
                    {rentalItems.map(item => (
                        <RentalItem
                            key={item.id}
                            item={item}
                            onMessageSeller={handleMessageSeller} />
                    ))}
                </PropertyBox>
            </div>
            {editModalIsOpen && (
                <EditListingModal
                    setIsOpen={setEditModalIsOpen}
                    handler={() => fetchUserListings()}
                    formData={selectedListing}
                />
            )}
        </div>
    );
}

export default AccountPage;