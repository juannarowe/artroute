import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  venue: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, min: -90, max: 90 })
  lat: number;

  @Prop({ required: true, min: -180, max: 180 })
  lng: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: false, trim: true })
  externalLink?: string;

  // Firebase uid of the owner, set by the backend from the auth token.
  @Prop({ required: true, trim: true })
  createdBy: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'published', 'rejected'],
  })
  status: 'pending' | 'published' | 'rejected';

  @Prop({ trim: true })
  rejectionNote?: string;

  @Prop({ type: [String], default: [] })
  attendees: string[];
}

export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
