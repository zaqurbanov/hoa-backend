import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";


export type ChatHistoryDocument =HydratedDocument<ChatHistory>

@Schema()
export class ChatHistory {
  @Prop()
  title!: string
  @Prop()
  documentId!: mongoose.Types.ObjectId;
  @Prop()
  answer!: string
  @Prop()
  question!: string
  @Prop({
    type:Date,
    default:Date.now
  })
  updatedAt!: Date
}
export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory)