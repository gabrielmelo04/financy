import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";
import { TransactionType } from "../../generated/prisma/enums.js";
import { CategoryModel } from "./category.model.js";
import { UserModel } from "./user.model.js";

registerEnumType(TransactionType, {
    name: "Type",
    description: "The type of transaction, either input or output"
});

@ObjectType()
export class TransactionModel { 

    @Field(() => ID)
    id!: string;

    @Field(() => String)
    title!: string;

    @Field(() => Number)
    amount!: number;

    @Field(() => GraphQLISODateTime)
    date!: Date;

    @Field(() => TransactionType)
    type!: TransactionType;

    @Field(() => CategoryModel)
    category!: CategoryModel;

    @Field(() => UserModel)
    user!: UserModel;

    @Field(() => GraphQLISODateTime)
    createdAt!: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt!: Date;

}