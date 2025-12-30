import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

@Injectable()
export class UsersSeed implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      // Check if users already exist
      const existingUsers = await this.userModel.countDocuments();

      if (existingUsers === 0) {
        console.log('🌱 Seeding users...');

        const users = [
          {
            email: 'admin@safepass.com',
            password: await bcrypt.hash('Admin@123', 10),
            name: 'System Admin',
            role: 'admin',
            department: 'Administration',
            phone: '+1234567890',
            profileImage: null,
            isActive: true,
          },
          {
            email: 'security@safepass.com',
            password: await bcrypt.hash('Security@123', 10),
            name: 'Security Officer',
            role: 'security',
            department: 'Security',
            phone: '+1234567891',
            profileImage: null,
            isActive: true,
          },
          {
            email: 'host@safepass.com',
            password: await bcrypt.hash('Host@123', 10),
            name: 'Department Host',
            role: 'host',
            department: 'Engineering',
            phone: '+1234567892',
            profileImage: null,
            isActive: true,
          },
        ];

        await this.userModel.insertMany(users);
        console.log('✅ Users seeded successfully!');
      } else {
        console.log('✅ Users already exist in database');
      }
    } catch (error) {
      console.error('❌ Error seeding users:', error);
    }
  }
}
