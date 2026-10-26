import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "@/types/map";

// Center of Barcelona and a zoom level that shows the whole city
const BARCELONA_CENTER: [number, number] = [41.3874, 2.1686];
const CITY_ZOOM = 13;

interface EventsMapProps {
  pins: MapPin[];
}

// "Dumb" map: it only draws the pins it receives. It never fetches data.
export function EventsMap({ pins }: EventsMapProps) {
  return (
    <MapContainer
      center={BARCELONA_CENTER}
      zoom={CITY_ZOOM}
      // "isolate" keeps Leaflet's layers below the fixed bottom nav
      className="isolate h-[60vh] w-full rounded-lg lg:h-[70vh]"
    >
      {/* The map images come from OpenStreetMap (free, needs attribution) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pins.map((pin) => (
        <CircleMarker
          key={pin.id}
          center={[pin.lat, pin.lng]}
          radius={9}
          // "Going" events: filled black. Other events: white with a black border.
          pathOptions={{
            color: "#000000",
            weight: 2,
            fillColor: pin.isGoing ? "#000000" : "#ffffff",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <p className="font-semibold">{pin.title}</p>
            {pin.isGoing && <p>You're going ✓</p>}
            <Link to={`/events/${pin.id}`} className="underline">
              See details
            </Link>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
