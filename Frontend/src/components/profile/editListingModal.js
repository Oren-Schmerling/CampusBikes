import MapDropLocation from "../listings/mapDropLocation";
import { useState } from "react";
import { createListing } from "@/api/createListing";
import { updateListing } from "@/api/updateListing";
import { fetchListings } from "@/api/fetchListings";

export function EditListingModal({ setIsOpen, handler, formData: initialFormData }) {
    console.log("EditListingModal initialFormData:", initialFormData);

    const [formData, setFormData] = useState(() => ({
        title: initialFormData?.title || "",
        description: initialFormData?.description || "",
        price: initialFormData?.pricePerHour || "",
        location: initialFormData?.location || "",
        latitude: initialFormData?.latitude || "42.3870",
        longitude: initialFormData?.longitude || "-72.5289",
        ownerId: initialFormData?.ownerId || null,
        id: initialFormData?.id || null,
    }));


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: formData.id,
            ownerId: formData.ownerId,
            title: formData.title,
            description: formData.description,
            pricePerHour: parseFloat(formData.price),
            location: formData.location,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
        };
        console.log(payload);
        const result = await updateListing(payload);
        console.log("Update response", { result });
        setIsOpen(false);
        handler();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative bg-gray-100 rounded-2xl p-10 w-full max-w-5xl shadow-2xl z-10">
                {/* Close button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-nearBlack transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-3xl font-bold text-nearBlack mb-8 text-center">
                    Edit Listing
                </h2>

                {/* Layout split */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 w-full md:w-1/2"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter listing title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe your listing"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent resize-none"
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Per Hour ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="City, State"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-waxwingGreen focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-waxwingGreen text-white py-3 rounded-lg font-medium hover:bg-waxwingLightGreen active:bg-waxwingDarkGreen transition-colors cursor-pointer"
                            >
                                Update Listing
                            </button>
                        </div>
                    </form>

                    {/* Right: Map */}
                    <div className="w-full md:w-1/2 h-[400px]">
                        <MapDropLocation
                            onPositionChange={(pos) => {
                                console.log("Selected position:", pos);
                                formData.latitude = pos.lat;
                                formData.longitude = pos.lng;
                            }}
                            startPos={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
