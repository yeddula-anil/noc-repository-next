import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // always ask account selection
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("nocportal");
        const user = await db.collection("users").findOne({ email: credentials.email });

        console.log("Login attempt for:", credentials.email);
        console.log("User found:", user);

        if (!user) {
          console.log("No user found");
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Password valid?", isValid);

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          roles: user.roles || ["student"],
        };
      }

    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.roles = user.roles || ["student"];
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles || ["student"];
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Check user role and redirect accordingly
      if (url.startsWith("/")) url = `${baseUrl}${url}`;
      return url;
    },
  },

  pages: {
    signIn: "/auth/login", // custom login page
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
