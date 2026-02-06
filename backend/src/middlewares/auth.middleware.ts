import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";
import { UserContext } from "../graphql/context/index.js";

export const IsAuth: MiddlewareFn<UserContext> = async ({ context }, next) => { 

    if (context.authError === "INVALID_TOKEN") {
        throw new GraphQLError("Invalid token", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }
    if(!context.user) {
        throw new GraphQLError("Not authenticated", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    return next();
}