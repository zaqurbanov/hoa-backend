import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type DocumentDocument = HydratedDocument<Document>;
@Schema()
export class Document {
  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true })
  size!: number;

  @Prop({ required: true })
  pages!: number;

  @Prop({ default: 'pending' })
  status!: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
