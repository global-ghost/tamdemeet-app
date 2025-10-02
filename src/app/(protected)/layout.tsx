import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@components/ui';
import { SignOutButton } from '@shared/auth/SignOutButton';
import { auth } from 'auth';
import { SessionProvider } from 'next-auth/react';
import logo from 'public/images/logo-short.svg';
import { MapProvider } from '../MapsProvider';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = auth();
  if (!session) {
    return null;
  }
  return (
    <div className='flex min-h-screen'>
      <div className='flex w-full max-w-[60px] flex-col bg-navbar px-[10px]'>
        <div className='flex justify-center py-8'>
          <Image src={logo} alt='logo' height={24} priority />
        </div>

        <nav className='mt-2 flex h-full flex-col text-center'>
          <Link className='my-4 block pb-4' href='/map'>
            <Icon icon='location' size={24} />
          </Link>
          <Link className='my-4 block pb-4' href='/contacts'>
            <Icon icon='group' size={24} />
          </Link>

          <Link className='my-4 block pb-4' href='/settings'>
            <Icon icon='settings' size={24} />
          </Link>
          <div className='mt-6'>
            <SignOutButton />
          </div>
        </nav>
      </div>

      <div className='flex w-full flex-col'>
        {/* <header className='h-20 w-full bg-card py-8 pl-4'>Header</header> */}

        <main className='m-[7px] grow py-2 sm:px-1 lg:m-4 lg:p-2'>
          <SessionProvider>
            <MapProvider>{children}</MapProvider>
          </SessionProvider>
        </main>

        <footer className='static mt-8 h-20 w-full py-8 pl-4 text-center text-xs sm:text-sm'>
          @ 2025 Tamdemeet. All right reserved.
        </footer>
      </div>
    </div>
  );
}
