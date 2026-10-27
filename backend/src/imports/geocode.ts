// Turns an address into map coordinates with Nominatim (OpenStreetMap, free).
// Its rules: max 1 request per second and a User-Agent that names the app.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export interface Coordinates {
  lat: number;
  lng: number;
}

// One search result from Nominatim (only the fields we use)
interface NominatimPlace {
  lat: string;
  lon: string;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Returns null when the address is not found or the request fails.
export async function geocodeAddress(
  address: string,
): Promise<Coordinates | null> {
  await wait(1000); // respect the 1 request per second rule

  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ArtRoute/1.0 (IT Academy student project)' },
    });
    if (!response.ok) {
      return null;
    }
    const places = (await response.json()) as NominatimPlace[];
    if (places.length === 0) {
      return null;
    }
    // Nominatim sends the numbers as text, e.g. "41.3851"
    return { lat: Number(places[0].lat), lng: Number(places[0].lon) };
  } catch {
    return null;
  }
}
