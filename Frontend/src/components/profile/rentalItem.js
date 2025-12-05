import React from 'react';
import { Calendar, Clock, Bike } from 'lucide-react';

const RentalItem = ({ item }) => {
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

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
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
    );
};

export default RentalItem;