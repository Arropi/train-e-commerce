import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            role: string;
            accessToken: string;
        } & DefaultSession['user'];
    }

    interface User{
        
        role: string;
        accessToken: string;
    }

}

declare module "next-auth/jwt" {
    interface JWT{
        role: string;
        accessToken: string;
        id: string;
    }
}