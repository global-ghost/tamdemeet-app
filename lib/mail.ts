import { CustomError } from 'actions/response';
import { env } from 'process';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export const sendTowFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'Tamdemeet <noreply@tamdemeet.de>',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/email-verification?token=${token}`;
  const { error } = await resend.emails.send({
    from: 'Tamdemeet <noreply@tamdemeet.de>',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });

  if (error) {
    throw new CustomError();
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;
  const { error } = await resend.emails.send({
    from: 'Tamdemeet <noreply@tamdemeet.de>',
    to: email,
    subject: 'Reset password',
    html: `<p>Click <a href="${confirmLink}">here</a> to reset password.</p>`,
  });

  if (error) {
    throw new CustomError();
  }
};
