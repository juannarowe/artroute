import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../events/schema/events.schema';
import type { AuthUser } from '../auth/firebase-auth.guard';
import { fetchUpcomingOpenings } from './graf-api';
import { decodeHtml, fetchEventPage } from './event-page';
import { extractEventDetails } from './gemini';
import { geocodeAddress } from './geocode';

// Keeps each run short and inside the free Gemini/Nominatim limits
export const MAX_IMPORTS_PER_RUN = 10;
// "createdBy" of imported events (they have no real Firebase user)
export const IMPORT_USER = 'artbarcelona-import';

@Injectable()
export class ImportsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  // Creates "pending" events from the ArtBarcelona (GRAF) agenda.
  // An admin reviews them in the Manage page before they are public.
  async importFromArtBarcelona(user: AuthUser) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can import events');
    }

    const openings = await fetchUpcomingOpenings();
    let imported = 0;
    let skipped = 0;

    for (const opening of openings) {
      if (imported >= MAX_IMPORTS_PER_RUN) {
        break;
      }

      // Already imported before (any status)? Then don't create it twice.
      const existingEvent = await this.eventModel
        .findOne({ externalLink: opening.link })
        .exec();
      if (existingEvent) {
        skipped++;
        continue;
      }

      const title = decodeHtml(opening.title.rendered);
      const page = await fetchEventPage(opening.link);
      const details = await extractEventDetails(
        title,
        opening.abe_event_venue,
        page.text,
      );
      if (!details) {
        skipped++; // Gemini failed: we don't know the address
        continue;
      }

      const coordinates = await geocodeAddress(details.address);
      if (!coordinates) {
        skipped++; // no coordinates = no pin on the map
        continue;
      }

      await this.eventModel.create({
        title,
        venue: opening.abe_event_venue,
        address: details.address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        date: parseBarcelonaTime(opening.start),
        category: details.category,
        description: details.description,
        price: details.price,
        image: page.imageUrl,
        externalLink: opening.link,
        createdBy: IMPORT_USER,
        status: 'pending',
      });
      imported++;
    }

    return { imported, skipped };
  }
}
