

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type MessageDocument = HydratedDocument<Message>

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  })
  conversationId!: mongoose.Types.ObjectId
  @Prop()
  answer!: string
  @Prop()
  question!: string
  @Prop({
    required: true,
    type: Date,

  })
  createdAt!: Date
  @Prop({
    required: true,
    type: Date,
    default: Date.now
  })
  updatedAt!: Date

}
export const MessageSchema = SchemaFactory.createForClass(Message)