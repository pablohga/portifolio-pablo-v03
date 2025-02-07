import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyStripeSubscription } from "@/lib/stripe/subscription";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        const email = credentials.email;
        if (!email) {
          throw new Error("Email is required");
        }
        const stripeTier = await verifyStripeSubscription(email);
        if (stripeTier !== user.subscriptionTier) {
          user.subscriptionTier = stripeTier;
          await user.save();
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const email = user.email;
        if (!email) {
          throw new Error("Email is required");
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          const stripeTier = await verifyStripeSubscription(email);
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            subscriptionTier: stripeTier,
          });
        } else {
          const stripeTier = await verifyStripeSubscription(email);
          if (stripeTier !== existingUser.subscriptionTier) {
            existingUser.subscriptionTier = stripeTier;
            await existingUser.save();
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;

        // Busca o slug do usuário no banco de dados
        if (user.email) {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });
          if (existingUser?.slug) {
            token.slug = existingUser.slug; // Adiciona o slug ao token
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.slug = token.slug as string | undefined; // Adiciona o slug à sessão
      }
      return session;
    },
  },
};