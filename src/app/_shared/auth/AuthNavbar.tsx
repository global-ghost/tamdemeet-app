'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AuthNavbar = () => {
  const pathname = usePathname();

  return (
    <div className='text-center text-3xl'>
      <Link
        title='Sign in'
        href='/auth/sign-in'
        className={`${
          pathname === '/auth/sign-up'
            ? 'text-primary hover:underline'
            : 'pointer-events-none text-white'
        }`}
      >
        Sign in
      </Link>
      <span> / </span>
      <Link
        title='Sign up'
        href={'/auth/sign-up'}
        className={`${
          pathname === '/auth/sign-in'
            ? 'text-primary hover:underline'
            : 'pointer-events-none text-white'
        }`}
      >
        Sign up
      </Link>
    </div>
  );
};
