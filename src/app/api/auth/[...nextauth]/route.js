import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function getRoleFromEmail(email) {
  if (email.endsWith("@rguktrkv.ac.in")) return "DSW";
  if (email.startsWith("vikasyeddula")) return "CARETAKER";
  if (email.endsWith("@caretaker.com")) return "DEAN";
  return "STUDENT";
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
          id: user._id.toString(),
          email: user.email,
          role: user.role || getRoleFromEmail(user.email),
        };

      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
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

        // Ensure role is always returned (either from DB or new user)
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role || getRoleFromEmail(user.email),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // Persist role in token
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Expose role in session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
