import NextAuth, { Session, User, type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt/types.js";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // // Include user.id on session
  // callbacks: {
  //   session({ session, user }) {
  //     if (session.user) {
  //       session.user.id = user.id;
  //     }
  //     return session;
  //   },
  // },
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,playlist-read-private',
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, user }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
