'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signIn } from 'auth';
import { compare } from 'bcryptjs';
import { getTwoFactorConfirmationByUserId } from 'data/two-factor-confirmation';
import { getTwoFactorTokenByToken } from 'data/two-factor-token';
import { getUserByIdentifier } from 'data/user';
import { db } from 'lib/db';
import { sendTowFactorTokenEmail } from 'lib/mail';
import { generateTwoFactorToken } from 'lib/tokens';
import { AuthError } from 'next-auth';
import { LoginSchema } from 'schemas';
import { CustomError, handleServerError, type Response } from '../response';
import type * as z from 'zod';

export const login = async (
  values: z.infer<typeof LoginSchema>,
): Promise<Response<{ twoFactor: boolean } | null>> => {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      // TODO: return invalid fields data?
      throw new CustomError('Invalid Fields');
    }

    const { identifier, password, code } = values;

    const existingUser = await getUserByIdentifier(identifier);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      throw new CustomError('Invalid Credentials');
    }

    if (!existingUser.emailVerified) {
      cookies().set('email', existingUser.email, {
        httpOnly: true,
        sameSite: 'strict',
      });

      redirect(`/auth/error?error=EmailNotVerified`);
    }

    if (existingUser.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByToken(code);
        if (!twoFactorToken) {
          throw new CustomError('Invalid code!');
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          throw new CustomError('Code expired!');
        }

        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }

        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          },
        });
      } else {
        const passwordsMatch = await compare(password, existingUser.password);
        if (!passwordsMatch) {
          throw new CustomError('Invalid Credentials');
        }
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTowFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        );

        return {
          ok: true,
          data: { twoFactor: true },
          message: 'Confirmation email sent. Check your email!',
        };
      }
    }

    await signIn('credentials', {
      identifier,
      password,
      redirect: false,
    });

    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return handleServerError(new CustomError('Invalid Credentials'));
      }
    }

    return handleServerError(error);
  }
};
