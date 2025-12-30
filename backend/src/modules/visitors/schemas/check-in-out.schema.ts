import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CheckInOutDocument = HydratedDocument<CheckInOut>;

@Schema({ timestamps: true })
export class CheckInOut {
  @Prop({ type: Types.ObjectId, ref: 'Visitor', required: true })
  visitorId: Types.ObjectId;

  @Prop({ required: true })
  visitorName: string;

  @Prop({ required: true })
  cnic: string;

  @Prop({ required: true })
  gatePassNumber: string;

  @Prop({ required: true })
  checkInTime: Date;

  @Prop()
  checkOutTime?: Date;

  @Prop({ enum: ['checked-in', 'checked-out'], default: 'checked-in' })
  status: string;

  @Prop()
  notes?: string;
}

export const CheckInOutSchema = SchemaFactory.createForClass(CheckInOut);
