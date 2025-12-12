import React from 'react';
import { User } from 'lucide-react'

const PropertyBox = ({ name, children }) => {
    return (
        <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-4">{name}</h2>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};

export default PropertyBox;