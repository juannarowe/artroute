export type EventStatus = "pending" | "published" | "rejected";

export interface ArtEvent {
  _id: string;
  title: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
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

export interface CreateEventInput {
  title: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  externalLink?: string;
}

export interface UpdateStatusInput {
  status: "published" | "rejected";
  rejectionNote?: string;
}

export interface EventFilters {
  status?: EventStatus;
  owner?: string;
}
