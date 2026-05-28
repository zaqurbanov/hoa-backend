import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type ChunkDocument = HydratedDocument<Chunk>;

@Schema()
export class Chunk {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    index: true,
    required: true,
  })
  documentId!: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  text!: string;

  @Prop({})
  page?: number;

  @Prop({ type: [Number], required: true })
  embedding!: number[];

  @Prop({ required: true })
  embeddingModel!: string;
}
export const ChunkSchema = SchemaFactory.createForClass(Chunk);
