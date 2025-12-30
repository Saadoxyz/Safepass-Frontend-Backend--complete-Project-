import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FlaggedVisitorDocument = HydratedDocument<FlaggedVisitor>;

@Schema({ timestamps: true })
export class FlaggedVisitor {
  @Prop({ type: Types.ObjectId, ref: 'Visitor', required: true })
  visitorId: Types.ObjectId;

  @Prop({ required: true })
  visitorName: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  flaggedBy: Types.ObjectId;

  @Prop()
  notes?: string;

  @Prop({ enum: ['flagged', 'resolved'], default: 'flagged' })
  status: string;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  resolvedNotes?: string;
}

export const FlaggedVisitorSchema =
  SchemaFactory.createForClass(FlaggedVisitor);
