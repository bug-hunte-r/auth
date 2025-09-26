import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "src/enum/User-Role";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop({type: UserRole})
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User)