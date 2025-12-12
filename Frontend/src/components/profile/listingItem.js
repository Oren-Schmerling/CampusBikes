import React from 'react';
import { MapPin, DollarSign, Edit2 } from 'lucide-react';

const ListingItem = ({ item, onEdit }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 relative">
            <button
                onClick={() => onEdit(item)}
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
                <Edit2 size={16} className="text-gray-600" />
            </button>

            <h3 className="text-lg font-semibold mb-2 pr-8">{item.model}</h3>

            <p className="text-md text-black-600 mb-3 line-clamp-2">
                {item.title}
            </p>

            <div className="flex items-center text-sm text-gray-700 mb-2">
                <MapPin size={14} className="mr-1" />
                <span>{item.location}</span>
            </div>

            <div className="flex items-center text-green-600 font-semibold">
                <DollarSign size={16} />
                <span className="text-gray-700">{item.pricePerHour} / hour</span>
            </div>
        </div>
    );
};

export default ListingItem;