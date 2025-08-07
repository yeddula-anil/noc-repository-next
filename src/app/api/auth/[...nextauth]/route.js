import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function getRoleFromEmail(email) {
  if (email.endsWith("@admin.com")) return "admin";
  if (email.endsWith("@hod.com")) return "hod";
  if (email.endsWith("@caretaker.com")) return "caretaker";
  return "student";
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id,
          email: user.email,
          roles: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Force account selection
        },
      },
      async profile(profile) {
        await mongoose.connect(process.env.MONGODB_URI);
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          const role = getRoleFromEmail(profile.email);
          user = await User.create({
            fullName: profile.name,
            email: profile.email,
            password: "",
            role,
            verified: true,
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          roles: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.roles = user.roles;
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
