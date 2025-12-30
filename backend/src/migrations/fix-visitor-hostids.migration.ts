import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

/**
 * This migration script fixes invalid hostId values in visitor records
 * Run with: npm run migrate:fix-hostids
 */

async function fixVisitorHostIds() {
  try {
    // Connect to MongoDB
    const mongoUrl =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/safepass';
    const conn = await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    // Get the Visitor collection
    const visitorCollection = conn.connection.collection('visitors');

    // First, get all visitors without filtering by hostId type (to avoid ObjectId casting errors)
    const allVisitors = await visitorCollection.find({}).toArray();
    console.log(`Found ${allVisitors.length} total visitors`);

    let invalidCount = 0;
    const invalidHostIds: Types.ObjectId[] = [];

    // Check each visitor for invalid hostIds
    for (const visitor of allVisitors) {
      if (visitor.hostId) {
        // If hostId is a string and not a valid ObjectId, mark for removal
        if (typeof visitor.hostId === 'string') {
          if (!Types.ObjectId.isValid(visitor.hostId)) {
            invalidHostIds.push(visitor._id);
            invalidCount++;
          }
        }
      }
    }

    console.log(`Found ${invalidCount} visitors with invalid hostIds`);

    // Delete records with invalid hostIds
    if (invalidHostIds.length > 0) {
      const result = await visitorCollection.deleteMany({
        _id: { $in: invalidHostIds },
      });

      console.log(
        `Deleted ${result.deletedCount} visitors with invalid hostIds`,
      );
    }

    // Also clean up null and empty hostIds
    const nullResult = await visitorCollection.updateMany(
      { $or: [{ hostId: null }, { hostId: '' }] },
      { $unset: { hostId: '' } },
    );

    console.log(
      `Cleaned up ${nullResult.modifiedCount} visitors with null/empty hostIds`,
    );
    console.log('Migration completed successfully');

    await conn.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
void fixVisitorHostIds()
  .then(() => {
    console.log('✅ Migration complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
