import authConfig from 'auth.config';
import NextAuth from 'next-auth';
import type { User as PrismaUser, UserSession } from '@prisma/client';
import type { UserDto } from 'data/user';
import type { DefaultSession } from 'next-auth';

declare module '@auth/core/types' {
  interface User extends UserDto {}
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: PrismaUser['role'];
    name?: PrismaUser['name'];
    isTwoFactorEnabled: PrismaUser['isTwoFactorEnabled'];
    UserSession?: UserSession;
    image?: PrismaUser['image'];
    sessionId: string;
    isTwoFactorAvailable?: boolean;
  }
}

declare module 'next-auth' {
  interface Session {
    user?: Omit<DefaultSession['user'], 'id'> & {
      id: string;
      image?: PrismaUser['image'];
      name: PrismaUser['name'];
      sessionId?: string;
      UserSession?: UserSession;
      isTwoFactorEnabled?: PrismaUser['isTwoFactorEnabled'];
      isTwoFactorAvailable?: boolean;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
