'use server';

import { hash } from 'bcryptjs';
import { createUserSession } from 'data/session';
import { createUser, getUserByEmail, getUserByLogin } from 'data/user';
import { sendVerificationEmail } from 'lib/mail';
import { generateVerificationToken } from 'lib/tokens';
import { RegisterSchema } from 'schemas';
import { CustomError, handleServerError, type Response } from '../response';
import type * as z from 'zod';

export const register = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<Response> => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new CustomError('Invalid fields');
    }

    const { email, password, login } = validatedFields.data;
    const hashedPassword = await hash(password, 10);

    if (login) {
      const existantUserByLogin = await getUserByLogin(login);

      if (existantUserByLogin) {
        throw new CustomError('User with the login already exist');
      }
    }

    const existantUserByEmail = await getUserByEmail(email);

    if (existantUserByEmail) {
      throw new CustomError('User with the email already exist');
    }

    const createdUser = await createUser({
      email,
      login,
      password: hashedPassword,
    });

    await createUserSession(createdUser.id);

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
