import Image from 'next/image';
import Link from 'next/link';
import meetImage from 'public/images/home.png';
import logo from 'public/images/logo.svg';

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center pt-[40px]'>
        <Image src={logo} alt='logo' height={48} priority />
        <p className='mt-[68px] text-[18px] font-semibold '>
          Your Social Map for Real-Life Events
        </p>
        <p className='mt-[10px] max-w-[320px] text-center text-[16px] text-warning'>
          Create events, add friends, and stay connected — all through an
          interactive map.
        </p>

        <Link
          href={'/auth/sign-in'}
          title='Sign in'
          className='mb-[30px] mt-[20px] text-[20px] font-semibold text-primary hover:underline'
        >
          SIGN IN
        </Link>

        <div className='absolute bottom-0'>
          <Image
            className='mt-[30px] max-h-[calc(100vh-300px)] object-contain'
            priority
            src={meetImage}
            alt='meet'
            width={500}
            height={300}
          />
        </div>
      </div>
    </main>
  );
}
