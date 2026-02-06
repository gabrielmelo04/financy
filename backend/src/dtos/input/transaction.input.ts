import { Field, InputType } from "type-graphql";
import { TransactionType } from "../../../generated/prisma/enums.js";


@InputType()
export class CreateTransactionInput {
    @Field(() => String)
    title!: string;

    @Field(() => TransactionType)
    type!: TransactionType;

    @Field(() => Number)
    amount!: number;

    @Field(() => String)
    categoryId!: string;

    @Field(() => Date)
    date!: Date;

    @Field(() => String)
    userId!: string;
}

@InputType()
export class UpdateTransactionInput {

    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => TransactionType, { nullable: true })
    type?: TransactionType;

    @Field(() => Number, { nullable: true })
    amount?: number;

    @Field(() => Date, { nullable: true })
    date?: Date;

    @Field(() => String, { nullable: true })
    categoryId?: string;
}