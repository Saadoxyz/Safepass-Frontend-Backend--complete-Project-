import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { Visitor, VisitorSchema } from './schemas/visitor.schema';
import { CheckInOut, CheckInOutSchema } from './schemas/check-in-out.schema';
import {
  FlaggedVisitor,
  FlaggedVisitorSchema,
} from './schemas/flagged-visitor.schema';
import {
  SuspiciousReport,
  SuspiciousReportSchema,
} from './schemas/suspicious-report.schema';
import { GatePassesModule } from '../gate-passes/gate-passes.module';
import { EmailModule } from '../email/email.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorSchema },
      { name: CheckInOut.name, schema: CheckInOutSchema },
      { name: FlaggedVisitor.name, schema: FlaggedVisitorSchema },
      { name: SuspiciousReport.name, schema: SuspiciousReportSchema },
    ]),
    GatePassesModule,
    EmailModule,
    WebsocketModule,
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
  exports: [VisitorsService],
})
export class VisitorsModule {}
