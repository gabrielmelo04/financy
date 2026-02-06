import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { UserModel } from "./user.model.js";


@ObjectType()
export class CategoryModel { 
    @Field(() => ID)
    id!: string

    @Field(() => String)
    name!: string

    @Field(() => String, { nullable: true })
    description!: string | null

    @Field(() => String)
    icon!: string

    @Field(() => String)
    color!: string

    @Field(() => Number)
    transactionCount!: number

    @Field(() => UserModel)
    user!: UserModel

    @Field(() => GraphQLISODateTime)
    createdAt!: Date

    @Field(() => GraphQLISODateTime)
    updatedAt!: Date

}