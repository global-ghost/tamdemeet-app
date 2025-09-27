import { cookies } from 'next/headers';
import Link from 'next/link';
import { Icon } from '@components/ui';
import { SendVerificationButton } from '@shared/auth/SendVerificationMailButton';

type ErrorName =
  | 'EmailNotVerified'
  | 'EmailVerificationExpired'
  | 'ResetPasswordExpired';
type SearchParams = {
  error?: ErrorName;
};

const errors: Record<ErrorName, string> = {
  EmailNotVerified: 'Email is not verified. Check your mail',
  EmailVerificationExpired:
    'Time of verification has expired. Please repeat the action.',
  ResetPasswordExpired:
    'Time of reset password expired. Please repeat the action',
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const { error } = searchParams;
  const cookieStore = cookies();
  const email = cookieStore.get('email')?.value;
  const errorMessage = error ? errors[error] : 'Oops! Something went wrong!';

  return (
    <>
      <p className='text-center align-middle text-3xl text-error'>
        <Icon size={32} icon='warning' color='error' /> Auth error
      </p>
      <p className='mt-2 text-center'>{errorMessage}</p>

      {error &&
        email &&
        (error === 'EmailNotVerified' ||
          error === 'EmailVerificationExpired') && (
          <div className='mt-6 flex flex-col justify-center'>
            <p className='mb-4 text-sm'>{`Send another message to ${email}?`}</p>
            <SendVerificationButton email={email} />
          </div>
        )}

      {error && error === 'ResetPasswordExpired' && (
        <div className='mt-5 flex justify-center'>
          <Link
            href={'/auth/reset-password'}
            title='Back to sign in'
            className='text-primary hover:underline'
          >
            Reset password
          </Link>
        </div>
      )}
      <div className='mt-5 flex justify-center'>
        <Link
          href={'/auth/sign-in'}
          title='Back to sign in'
          className='text-primary hover:underline'
        >
          Go back to sign in
        </Link>
      </div>
    </>
  );
}
