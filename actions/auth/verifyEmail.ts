'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserByEmail } from 'data/user';
import { getVerificationTokenByToken } from 'data/verification-token';
import { db } from 'lib/db';
import { CustomError, handleServerError } from '../response';
import type { Response } from '../response';

export const verifyEmail = async (token: string): Promise<Response> => {
  try {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      throw new CustomError();
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      cookies().set('email', existingToken.email, {
        httpOnly: true,
        sameSite: 'strict',
      });
      return redirect('/auth/error?error=EmailVerificationExpired');
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      throw new CustomError();
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { message: 'Email has been successfully verified!', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
