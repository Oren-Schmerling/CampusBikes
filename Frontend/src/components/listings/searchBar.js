"use client";

import { useState } from "react";
import { Search } from "lucide-react";

/* 
onSearch: function to call when search is submitted,
placeholder: placeholder text for the search input, defaults to "Search"
*/
export default function SearchBar({ onSearch, placeholder = "Search" }) {
  const [searchQuery, setSearchQuery] = useState("");

  // function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Handling search for:", searchQuery); // console log for debugging
    // since this is a general method, onSearch may not have been passed, so check first that it exists and is a function
    if (typeof onSearch === 'function') {
      onSearch(searchQuery);
    }
  };

  // function to handle input changes
  const handleChange = (e) => {
    const value = e.target.value; // extract value from event (which should be input field of the search bar)
    setSearchQuery(value); // set search query to value
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery} // display current search query
          onChange={handleChange} // update search query on input change
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}