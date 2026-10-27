import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../events/schema/events.schema';
import type { AuthUser } from '../auth/firebase-auth.guard';
import { fetchUpcomingOpenings, parseBarcelonaTime } from './graf-api';
import { decodeHtml, fetchEventPage } from './event-page';
import { extractEventDetails } from './gemini';
import { geocodeAddress } from './geocode';

export const MAX_IMPORTS_PER_RUN = 10;
export const IMPORT_USER = 'artbarcelona-import';

@Injectable()
export class ImportsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

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
        skipped++;
        continue;
      }

      const coordinates = await geocodeAddress(details.address);
      if (!coordinates) {
        skipped++;
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
