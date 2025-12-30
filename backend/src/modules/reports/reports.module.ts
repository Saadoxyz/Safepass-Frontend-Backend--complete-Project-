import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ExportService } from './services/export.service';
import { Report, ReportSchema } from './schemas/report.schema';
import { Visitor, VisitorSchema } from '../visitors/schemas/visitor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Visitor.name, schema: VisitorSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ExportService],
})
export class ReportsModule {}
