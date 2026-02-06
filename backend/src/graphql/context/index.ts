import { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { JwtPayload, verifyJwt } from "../../utils/token.js";


export type UserContext = {
    user: {
        id: string;
        name: string;
    } | undefined;
    authError?: "INVALID_TOKEN";
    token: string | undefined;
    req: ExpressContextFunctionArgument['req'];
    res: ExpressContextFunctionArgument['res'];
}

export const createContext = async ({
    req, res
}: ExpressContextFunctionArgument): Promise<UserContext> => { 
    const authHeader = req.headers.authorization
    let user: { id: string; name: string } | undefined
    let token: string | undefined
    let authError: "INVALID_TOKEN" | undefined

    if (authHeader?.startsWith('Bearer ')) { 
        token = authHeader.substring('Bearer '.length)
        try {
            const payload = verifyJwt(token) as JwtPayload
            user = { id: payload.id, name: payload.name };
        }catch (err) {
            authError = "INVALID_TOKEN"
        }
    }
    return Promise.resolve({
        user,
        authError,
        token,
        req,
        res
    });
}