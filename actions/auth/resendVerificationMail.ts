'use server';

import { getUserByEmail } from 'data/user';
import { sendVerificationEmail } from 'lib/mail';
import { generateVerificationToken } from 'lib/tokens';
import { CustomError, handleServerError } from '../response';
import type { Response } from '../response';

export const resendVerificationEmail = async (
  email: string,
): Promise<Response> => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      throw new CustomError();
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { message: 'Confirmation email sent. Check your email!', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
