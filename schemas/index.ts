import * as z from 'zod';

const REQUIRED = 'Field is required';
const NO_SPACE = 'Space not allowed';

export const emailSchema = z.string().email();

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(1, REQUIRED)
    .refine((s: string) => !s.includes(' '), NO_SPACE),
  password: z.string().min(1, REQUIRED),
  code: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    email: z.string().min(1, REQUIRED).email(),
    login: z
      .string()
      .optional()
      .refine((s?: string) => !(s && s.includes(' ')), NO_SPACE)
      .refine(
        (s?: string) => !(s && s.length && s.length < 4),
        'Minimum 4 characters',
      )
      .refine(
        (s?: string) => !s || /^[a-zA-Z0-9_-]+$/.test(s),
        'Login can contain only letters, numbers, "-", and "_"',
      ),
    password: z.string().min(1, REQUIRED).min(6),
    confirmPassword: z.string().min(1, REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and Confirm Password do not match',
  });

export const ResetPasswordSchema = z.object({
  email: emailSchema,
});

export const NewPasswordSchema = z
  .object({
    password: z.string().min(1, REQUIRED).min(6),
    confirmPassword: z.string().min(1, REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and Confirm Password do not match',
  });

export const UpdateUserSettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.boolean(),
});

export const CreateFriendRequestSchema = z.object({
  identifier: z
    .string()
    .min(1, REQUIRED)
    .refine((s: string) => !s.includes(' '), NO_SPACE),
});

export const CreateUpdateEventSchema = z.object({
  title: z.string().min(3, REQUIRED),
  description: z.string().optional(),
  date: z
    .preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date(),
    )
    .optional(),
  invitedUserIds: z.array(z.string()).optional(),
  lat: z.number(),
  lng: z.number(),
});
