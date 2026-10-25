// One pin on the map: only what the map needs to know about an event
export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  isGoing: boolean;
}
