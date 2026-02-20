import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, AnyObject } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, required: true })
  shortCode: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: AnyObject) {
    delete ret._id;
  },
});
