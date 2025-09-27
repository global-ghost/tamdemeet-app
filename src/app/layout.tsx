import './globals.css';
import { Roboto } from 'next/font/google';
import Providers from './Providers';
import type { Metadata } from 'next';

const robotoMono = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: '300',
});

export const metadata: Metadata = {
  title: 'Tamdemeet',
  description: 'Your Social Map for Real-Life Events',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${robotoMono.className}`} lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
