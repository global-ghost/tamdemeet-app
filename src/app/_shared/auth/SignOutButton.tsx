'use client';

import { Button } from '@components/ui';
import { signOut } from 'next-auth/react';
// import { logout } from 'actions/auth/logout';

export const SignOutButton = () => {
  const onClick = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    await signOut({ callbackUrl: '/auth/sign-in' });

    window.location.href = '/auth/sign-in';
  };

  return (
    <Button
      variant='gray'
      icon='log-out'
      iconColor='error'
      iconSize={24}
      onClick={onClick}
    />
  );
};
