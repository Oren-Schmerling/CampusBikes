export async function fetchListings(setListings) {
  try {
    const res = await fetch("http://localhost:8080/listing/bikes");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // Map backend 'bikes' array to frontend-friendly structure
    const mappedListings = (data.bikes || []).map((item) => ({
      id: item.id,
      imageSrc:
        item.imageUrl || (item.title === "Bike" ? "/bike.jpg" : "/scooter.jpg"),
      model: item.model || item.title,
      latitude: item.latitude,
      longitude: item.longitude,
      distance: NaN,
      description: item.description,
      location: item.location,
      title: item.title,
      pricePerHour: item.pricePerHour || 0,
      seller: item.seller || "Unknown",
      rating: item.rating || Math.floor(Math.random() * 5) + 1,
    }));

    setListings(mappedListings);
  } catch (err) {
    console.error("Error fetching listings:", err);
  }
}
