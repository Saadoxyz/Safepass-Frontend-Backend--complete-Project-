import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GatePassDocument = GatePass & Document;

@Schema({ timestamps: true })
export class GatePass {
  @Prop({ required: true, unique: true })
  gatePassNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Visitor', required: true })
  visitorId: Types.ObjectId;

  @Prop({ required: true })
  qrCode: string;

  @Prop()
  issuedAt: Date;

  @Prop()
  validUntil: Date;

  @Prop()
  checkInTime: Date;

  @Prop()
  checkOutTime: Date;

  @Prop()
  gate: string;

  @Prop({ enum: ['active', 'used', 'expired', 'revoked'], default: 'active' })
  status: string;
}

export const GatePassSchema = SchemaFactory.createForClass(GatePass);
