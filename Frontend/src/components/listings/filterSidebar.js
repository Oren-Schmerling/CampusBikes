import { Star } from "lucide-react";

function FilterSidebar ({
  showBikes,
  setShowBikes,
  showScooters,
  setShowScooters,
  price,
  setPrice,
  rating,
  setRating,
  distance,
  setDistance,
}) {
    const handleBikeChange = () => {
        setShowBikes(!showBikes);
    };
    const handleScooterChange = () => {
        setShowScooters(!showScooters);
    };
    const handleStars = (value) => {
        setRating(value);
    };
  return (
    <div className="w-64 h-[500px] bg-lighterGray rounded-r-3xl overflow-hidden mt-8 border border-lightGray">
      <div className="w-full bg-waxwingGreen text-white text-2xl font-bold flex items-center justify-center gap-2 h-14.5 rounded-tr-3xl">
        <img
          src="filter-svgrepo-com.svg"
          alt="Filter Icon"
          className="h-[1em] w-[1em] align-middle"
        />
        <span className="align-middle">Filters</span>
      </div>
      <div className="space-y-2 p-4 pb-8">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Ride Type
        </div>
        <label className="flex items-center justify-start space-x-6 w-full pl-6">
          <input
            type="checkbox"
            checked={showBikes}
            onChange={handleBikeChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-left">Bikes</span>
        </label>
        <label className="flex items-center justify-start space-x-6 w-full pl-6">
          <input
            type="checkbox"
            checked={showScooters}
            onChange={handleScooterChange}
            className="accent-[var(--color-waxwingGreen)] w-6 h-6"
          />
          <span className="text-lg flex-1 text-left">Scooters</span>
        </label>
      </div>

      <div className="space-y-2 pb-8 w-full">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Hourly Price
        </div>
        <div className="flex flex-col items-center w-full space-y-2">
          <input
            type="range"
            min="0"
            max="25"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-3/4 h-2 accent-[var(--color-waxwingGreen)] rounded-lg"
          />
          <div className="flex justify-mid text-sm font-semibold text-gray-700">
            <span>${price}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-8 w-full">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Distance
        </div>
        <div className="flex flex-col items-center w-full space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-3/4 h-2 accent-[var(--color-waxwingGreen)] rounded-lg"
          />
          <div className="flex justify-center text-sm font-semibold text-gray-700">
            <span>{distance} Miles</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="w-full h-6 text-center justify-center text-lg font-bold">
          Rating
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              fill={rating >= star ? "var(--color-waxwingGreen)" : "#f2f2f2"}
              strokeWidth={1}
              // stroke="var(--color-waxwingGreen)"
              className={`w-8 h-8 cursor-pointer ${
                rating >= star
                  ? "text-[var(--color-waxwingGreen)]"
                  : "text-gray-300"
              }`}
              onClick={() => handleStars(star)}
            />
          ))}
        </div>
        <span className="flex justify-center text-sm font-semibold text-gray-700">
          {rating > 0
            ? `${rating} star${rating > 1 ? "s" : ""}+`
            : "Any rating"}
        </span>
      </div>
    </div>
  );
}

export default FilterSidebar;