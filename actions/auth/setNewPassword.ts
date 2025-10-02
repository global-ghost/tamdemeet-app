'use server';

import { redirect } from 'next/navigation';
import {
  CustomError,
  handleServerError,
  type Response,
} from 'actions/response';
import { hash } from 'bcryptjs';
import { getPasswordResetTokenByToken } from 'data/password-reset-token';
import { getUserByEmail } from 'data/user';
import { db } from 'lib/db';
import { NewPasswordSchema } from 'schemas';
import type * as z from 'zod';

export const setNewPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string,
): Promise<Response> => {
  try {
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new CustomError('Invalid fields');
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      throw new CustomError('Invalid token!');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return redirect('/auth/error?error=ResetPasswordExpired');
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      throw new CustomError();
    }

    const hashedPassword = await hash(values.password, 10);
    await db.user.update({
      where: { email: existingUser.email },
      data: {
        password: hashedPassword,
      },
    });

    await db.passwordResetToken.delete({
      where: {
        token: existingToken.token,
      },
    });

    return { message: 'Password successfully updated!', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
