import { AuthNavbar } from '@shared/auth/AuthNavbar';
import { GoogleAuthView } from '@shared/auth/GoogleAuthView';
import { SignUpForm } from '@shared/forms/SignUpForm';

export default function Page() {
  return (
    <>
      <AuthNavbar />
      <SignUpForm />
      <GoogleAuthView />
    </>
  );
}
