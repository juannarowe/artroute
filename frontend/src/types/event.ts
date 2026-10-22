export type EventStatus = "pending" | "approved" | "rejected";

// "ArtEvent" and not "Event": the browser already has a global Event type
// (click events, etc.), and using the same name would hide it.
export interface ArtEvent {
  _id: string;
  title: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  date: string; // ISO string: JSON has no Date type
  category: string;
  description: string;
  image?: string;
  price: number;
  externalLink?: string;
  createdBy: string;
  status: EventStatus;
  rejectionNote?: string;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  status?: EventStatus;
  owner?: string;
}
