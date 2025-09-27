import { AuthNavbar } from '@shared/auth/AuthNavbar';
import { GoogleAuthView } from '@shared/auth/GoogleAuthView';
import { SignInForm } from '@shared/forms/SignInForm';

export default function Page() {
  return (
    <>
      <AuthNavbar />
      <SignInForm />
      <GoogleAuthView />
    </>
  );
}
