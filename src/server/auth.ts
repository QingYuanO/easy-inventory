import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env";
import { db } from "@/server/db";
import { createTable, shops, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { roles } from "./db/schema";
import { compareSync } from "bcryptjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone: string;
      type:'shop'|'user'
    } & DefaultSession["user"];
  }

  interface User {
    phone: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {},
        password: {},
        type: {},
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.type) {
          return null;
        }

        if (credentials.type === "shop") {
          const shop = await db.query.shops.findFirst({
            where: eq(shops.phone, credentials.phone),
          });
          if (!shop) {
            throw new Error("用户不存在");
          }
          const passwordMatch = compareSync(
            credentials.password,
            shop.password,
          );
          if (!passwordMatch) {
            throw new Error("密码错误");
          }
          return {
            id: shop?.id,
            name: shop?.name,
            phone: shop?.phone,
            type:'shop'
          };
        }
        const user = await db.query.users.findFirst({
          where: eq(users.phone, credentials.phone),
        });
        if (!user) {
          throw new Error("用户不存在");
        }
        return {
          id: user?.id,
          name: user?.name,
          phone: user?.phone,
          type:'user'
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("user", user);

      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("token", token);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          phone: token.phone,
          type:token.type
        },
      };
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
