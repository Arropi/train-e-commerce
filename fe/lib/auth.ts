import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: { 
    strategy: 'jwt'
  },
  jwt: {
    maxAge: 60*60*24
  },
  callbacks: {
    async signIn({user, account, profile }) {
      if (account?.provider === "google" && profile?.email?.endsWith('@mail.ugm.ac.id')) {
        return true
      }
      return false 
    },
    async jwt({token, user, account}) {
      if(account){
        const fetching = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,  {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: user.email,
            username: user.name
          }),
        })
        const result = await fetching.json()
        console.log(result)
        token.role = "Mahasiswa"
        token.id = "2"
        token.accessToken = result.token
        token.email = user.email
      }
     return token
    },
    async session({session, token}){
      session.user.role = token.role
      session.user.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
};