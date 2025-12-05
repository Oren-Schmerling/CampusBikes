import React from 'react';
import { User } from 'lucide-react'

const ProfileCard = ({
  username,
  phoneNumber,
  email,
  onEdit,
  onLogout,
}) => {
  return (
    <div className="w-full bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="flex items-center justify-between">
        {/* Avatar and Info */}
        <div className="flex items-center gap-8">
          {/* Avatar, might want profile picture later? */}
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
            <User size='75' color='white' />
          </div>

          {/* User info */}
          <div className="flex gap-16">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
              <p className="text-xl font-semibold text-gray-900">{username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Phone Number</p>
              <p className="text-xl font-semibold text-gray-900">{phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
              <p className="text-xl font-semibold text-gray-900">{email}</p>
            </div>
          </div>
        </div>

        {/* Edit and delete buttons */}
        <div className="flex gap-4">
          <button
            onClick={onEdit}
            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full border-2 border-green-600 hover:bg-green-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onLogout}
            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full border-2 border-green-600 hover:bg-green-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;