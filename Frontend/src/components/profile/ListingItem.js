import React from 'react';
import { User } from 'lucide-react'

const ListingItem = ({
    item
}) => {
    return (
        <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-4">{item}</h2>
        </div>
    );
};

export default ListingItem;