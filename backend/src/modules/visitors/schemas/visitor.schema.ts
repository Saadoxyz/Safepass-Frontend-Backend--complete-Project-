import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema({ timestamps: true })
export class Visitor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cnic: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  purpose: string;

  @Prop()
  company?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  hostId: Types.ObjectId;

  @Prop()
  hostName?: string;

  @Prop()
  department?: string;

  @Prop({ required: true })
  visitDate: Date;

  @Prop({
    enum: ['pending', 'approved', 'rejected', 'checked-in', 'checked-out'],
    default: 'pending',
  })
  status: string;

  @Prop()
  gatePassNumber?: string;

  @Prop()
  qrCode?: string;

  @Prop()
  checkInTime?: Date;

  @Prop()
  checkOutTime?: Date;

  @Prop()
  notes?: string;

  @Prop()
  profileImage?: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
