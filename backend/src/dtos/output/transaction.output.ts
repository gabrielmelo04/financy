import { Field, ObjectType } from "type-graphql";
import { CategoryModel } from "../../models/category.model.js";
import { UserModel } from "../../models/user.model.js";


@ObjectType()
export class ListTransactionOutput {
    @Field(() => String)
    id!: string;

    @Field(() => String)
    title!: string;

    @Field(() => Number)
    amount!: number;

    @Field(() => Date)
    date!: Date;

    @Field(() => String)
    type!: string;

    @Field(() => CategoryModel)
    category!: CategoryModel;

    @Field(() => UserModel)
    user!: UserModel;
}