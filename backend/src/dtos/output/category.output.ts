import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../../models/user.model.js";


@ObjectType()
export class ListCategoryOutput {
    @Field(() => String)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    description!: string;

    @Field(() => String)
    icon!: string;

    @Field(() => String)
    color!: string;

    @Field(() => UserModel)
    userId!: string;
}