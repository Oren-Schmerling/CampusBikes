function LeftBar() {
  return (
    <div className="w-64 h-full bg-lighterGray">
      <div className="w-full h-6 text-center justify-center text-xl py-2 pb-32">
        Filters
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Type
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for bikes
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for scooters
        </div>
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Price
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for price slider
        </div>
      </div>
      <div className="space-y-4 pb-32">
        <div className="w-full h-6 text-center justify-center text-lg">
          Minimum Seller Rating
        </div>
        <div className="w-full h-6 text-center justify-center">
          Placeholder for Star Selector
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <>
      <LeftBar />
    </>
  );
}
