import { Field, InputType } from "type-graphql";


@InputType()
export class CreateUserInput {
    @Field(() => String)
    name!: string;
    @Field(() => String)
    email!: string;
    @Field(() => String)
    password!: string;
}

export class UpdateUserInput{
    @Field(() => String)
    name!: string;
}

