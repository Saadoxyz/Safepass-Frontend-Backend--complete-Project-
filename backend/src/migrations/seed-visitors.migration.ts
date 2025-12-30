import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

/**
 * This script adds sample visitors to the database with valid ObjectIds
 * Run with: npm run seed:visitors
 */

async function seedVisitors() {
  try {
    // Connect to MongoDB
    const mongoUrl =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/safepass';
    const conn = await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    // Get the Visitor collection
    const visitorCollection = conn.connection.collection('visitors');

    // Sample host ID (use the correct ObjectId from your database)
    // For demo, we'll use a placeholder that should be replaced
    const hostId = new Types.ObjectId('694042e407b944e8617253f2');

    const sampleVisitors = [
      {
        name: 'Saad Khan',
        cnic: '6110167938911',
        email: 'saad.khan@example.com',
        phone: '+923479926709',
        purpose: 'Official Meeting',
        company: 'Tech Corp',
        hostId: hostId,
        hostName: 'Department Host',
        department: 'engineering',
        visitDate: new Date('2025-12-22'),
        status: 'approved',
        gatePassNumber: `GP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ali Hassan',
        cnic: '3520156789123',
        email: 'ali.hassan@example.com',
        phone: '+923001234567',
        purpose: 'Client Meeting',
        company: 'Business Inc',
        hostId: hostId,
        hostName: 'Department Host',
        department: 'finance',
        visitDate: new Date('2025-12-22'),
        status: 'approved',
        gatePassNumber: `GP-${Date.now() + 1}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fatima Ahmed',
        cnic: '6110289456123',
        email: 'fatima.ahmed@example.com',
        phone: '+923459876543',
        purpose: 'Training Session',
        company: 'Education Ltd',
        hostId: hostId,
        hostName: 'Department Host',
        department: 'hr',
        visitDate: new Date('2025-12-22'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert sample visitors
    const result = await visitorCollection.insertMany(sampleVisitors);
    console.log(
      `✅ Inserted ${Object.keys(result.insertedIds).length} sample visitors`,
    );

    // Display created visitors
    console.log('\nCreated visitors:');
    sampleVisitors.forEach((visitor, index) => {
      console.log(
        `${index + 1}. ${visitor.name} - CNIC: ${visitor.cnic} - Status: ${visitor.status}`,
      );
    });

    await conn.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
void seedVisitors()
  .then(() => {
    console.log('✅ Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
