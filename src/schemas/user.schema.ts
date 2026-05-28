import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({
        required: true,
        type: String,
    })
    firstName!: string;

    @Prop({
        required: true,
        type: String,
    })
    lastName!: string;

    @Prop({
        required: true,
        type: String,
    })
    email!: string;

    @Prop({
        required: false,
        type: String,
    })
    picture?: string;

    @Prop({
        required: false,
        type: String,
    })
    googleId?: string;

    @Prop({
        required: true,
        enum: ['user', 'admin'],
    })
    role!: 'user' | 'admin';

    @Prop({
        required: true,
        type: Date,
        default: Date.now 
    })
    createdAt!: Date;

    @Prop({
        required: true,
        type: Date,
        default: Date.now
    })
    updatedAt!: Date;

    @Prop({
        required: true,
        type: String,
        enum:['level1','level2','level3','level4','level5']
    })
    level!: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
}


export const UserSchema = SchemaFactory.createForClass(User);