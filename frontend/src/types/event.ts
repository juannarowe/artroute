export type EventStatus = "pending" | "published" | "rejected";

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

// What the user sends to create an event (same fields as the backend
// CreateEventDto). status, createdBy and attendees are set by the server.
export interface CreateEventInput {
  title: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  date: string; // ISO string
  category: string;
  description: string;
  price: number;
  image?: string;
  externalLink?: string;
}

// What an admin sends to approve or reject an event (backend UpdateStatusDto)
export interface UpdateStatusInput {
  status: "published" | "rejected";
  rejectionNote?: string;
}

export interface EventFilters {
  status?: EventStatus;
  owner?: string;
}
