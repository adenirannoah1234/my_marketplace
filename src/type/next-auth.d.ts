import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    firebaseToken?: string
    googleAccessToken?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
}