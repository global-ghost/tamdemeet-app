'use server';

import {
  CustomError,
  handleServerError,
  type Response,
} from 'actions/response';
import { getUserByEmail } from 'data/user';
import { sendPasswordResetEmail } from 'lib/mail';
import { generateResetPasswordToken } from 'lib/tokens';
import { ResetPasswordSchema } from 'schemas';
import type * as z from 'zod';

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
): Promise<Response> => {
  try {
    const validatedFields = ResetPasswordSchema.safeParse(values);
    if (!validatedFields) {
      throw new CustomError();
    }
    const existingUser = await getUserByEmail(values.email);
    if (!existingUser) {
      throw new CustomError('Email not found!');
    }

    const passwordResetToken = await generateResetPasswordToken(values.email);

    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
    return { message: 'Reset email sent. Check your email!', ok: true };
  } catch (error) {
    return handleServerError({ error });
  }
};
