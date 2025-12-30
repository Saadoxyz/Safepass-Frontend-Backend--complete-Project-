// src/gate-passes/gate-passes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatePassesController } from './gate-passes.controller';
import { GatePassesService } from './gate-passes.service';
import { GatePass, GatePassSchema } from './schemas/gate-pass.schema';
import { Visitor, VisitorSchema } from '../visitors/schemas/visitor.schema'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GatePass.name, schema: GatePassSchema },
      { name: Visitor.name, schema: VisitorSchema }, // Add this line
    ]),
  ],
  controllers: [GatePassesController],
  providers: [GatePassesService],
  exports: [GatePassesService],
})
export class GatePassesModule {}
