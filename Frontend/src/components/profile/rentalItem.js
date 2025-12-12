import React from 'react';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { useState } from "react";
import MessageSellerForm from "@/components/listings/messageSellerForm";

const RentalItem = ({ item, onMessageSeller }) => {

    const [showMessageForm, setShowMessageForm] = useState(false);

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const hours = Math.abs(endDate - startDate) / 36e5;
        return hours;
    };

    const start = formatDateTime(item.startTime);
    const end = formatDateTime(item.endTime);
    const duration = calculateDuration(item.startTime, item.endTime);

    console.log(item)

    return (
        <>
            {showMessageForm && (
                <MessageSellerForm
                    id={item.bikeId}
                    onSend={(id, message) => {
                        onMessageSeller(id, message);
                        // temporary alert to simulate message sending
                        //alert("Message sent to seller!");
                        setShowMessageForm(false)
                    }}
                    onBack={() => setShowMessageForm(false)}
                />
            )}
            <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <button
                    onClick={() => setShowMessageForm(true)}
                    className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <MessageSquare size={16} className="text-gray-600" />
                </button>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Booking</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start">
                        <Calendar size={18} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="text-sm font-medium text-gray-800">{start.date}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Clock size={18} className="text-gray-500 mr-3 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">Rental Period</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">{start.time}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-sm font-medium text-gray-800">{end.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{duration} hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RentalItem;