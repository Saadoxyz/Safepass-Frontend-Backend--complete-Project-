import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { GatePassesModule } from './modules/gate-passes/gate-passes.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UploadModule } from './modules/upload/upload.module';
import { EmailModule } from './modules/email/email.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { UsersSeed } from './seed/users.seed';
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Import User model for seed
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    AuthModule,
    UsersModule,
    VisitorsModule,
    DepartmentsModule,
    GatePassesModule,
    NotificationsModule,
    ReportsModule,
    UploadModule,
    EmailModule,
    WebsocketModule,
    SettingsModule,
  ],
  providers: [UsersSeed],
})
export class AppModule {}
