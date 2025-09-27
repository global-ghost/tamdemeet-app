import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { createSession, createUserSession } from 'data/session';
import { getTwoFactorConfirmationByUserId } from 'data/two-factor-confirmation';
import { userDto, getUserByIdentifier, getUserById } from 'data/user';
import { db } from 'lib/db';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { LoginSchema } from 'schemas';
import type { User, UserSession } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';

export default {
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        return true;
      }

      if (!user?.emailVerified) {
        return false;
      }

      if (user.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id!,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = (await getUserById(token.sub)) as User & {
        UserSession: UserSession;
      };

      if (!existingUser) {
        return token;
      }

      const userSession = existingUser.UserSession;
      if (!userSession) {
        await createUserSession(existingUser.id);
      }

      if (!token.sessionId) {
        //   // TODO: check device/browser before create new session?
        const dbSession = await createSession();
        if (!dbSession) {
          return null;
        }

        const updatedUserSession = await db.userSession.update({
          where: { userId: existingUser.id },
          data: { sessionsIds: { push: dbSession?.id } },
        });
        token.sessionId = dbSession?.id;
        token.UserSession = updatedUserSession;
      } else {
        const session = await db.session.findUnique({
          where: { id: token.sessionId },
        });

        token.UserSession = existingUser.UserSession;

        if (!session) {
          return null;
        }
      }

      token.role = existingUser.role;
      token.image = existingUser.image;
      token.isTwoFactorAvailable = existingUser.isTwoFactorAvailable;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.name = existingUser.name;
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.name = token.name!;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.sessionId = token.sessionId;
        session.user.UserSession = token.UserSession;
        session.user.isTwoFactorAvailable = Boolean(token.isTwoFactorAvailable);
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  /* Whenever auth() is passed the res object, it will rotate the session expiry.
  This was not the case with getToken() previously. The default session expiry is 30 days,
  but you can change it by setting authOptions.session.maxAge.
  */
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { identifier, password } = validatedFields.data;

          const existingUser = await getUserByIdentifier(identifier);

          if (!existingUser || !existingUser.password) {
            return null;
          }

          const passwordsMatch = await compare(password, existingUser.password);

          if (passwordsMatch) {
            return userDto(existingUser);
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
