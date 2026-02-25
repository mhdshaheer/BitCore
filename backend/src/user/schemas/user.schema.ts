import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, AnyObject } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  declare _id: Types.ObjectId;
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  fullName: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string | null;

  @Prop({ type: Date, default: null })
  verificationTokenExpires: Date | null;

  @Prop({ type: String, default: null, select: false })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: AnyObject) {
    delete ret._id;
  },
});
