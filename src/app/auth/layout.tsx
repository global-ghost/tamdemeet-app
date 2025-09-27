import Image from 'next/image';
import { Card } from '@components/ui';
import logo from 'public/images/logo.svg';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tamdemeet | Sign in',
  description: 'description',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex justify-center'>
      <div className='mt-10 w-full max-w-96 px-4'>
        <div className='mb-10 flex justify-center'>
          <Image src={logo} alt='logo' height={34} priority />
        </div>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
