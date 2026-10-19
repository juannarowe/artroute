import { Logger } from "@nestjs/common";
import mongoose from 'mongoose';
import { Event, EventSchema } from '../events/schema/events.schema';
import { seedEvents } from "./seed-events";

const logger = new Logger('Seed');

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is missing in backend/.env');
    }

    await mongoose.connect(uri);
    // Same model name and schema the app uses → same "events" collection
    const EventModel = mongoose.model(Event.name, EventSchema);

    try {
        // Only the sample data: real events are never touched
        const deleted = await EventModel.deleteMany({ addedBy: /^seed-/ });
        const inserted = await EventModel.insertMany(seedEvents);
        logger.log(`Deleted ${deleted.deletedCount}, inserted ${inserted.length}`);
    } finally {
        // Always close the connection, even if something failed
        await mongoose.disconnect();
    }
}

seed().catch((error) => {
    logger.error(error);
    process.exitCode = 1; // tell the terminal the script failed
});
