const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface NominatimPlace {
  lat: string;
  lon: string;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function geocodeAddress(
  address: string,
): Promise<Coordinates | null> {
  await wait(1000);

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
    return { lat: Number(places[0].lat), lng: Number(places[0].lon) };
  } catch {
    return null;
  }
}
