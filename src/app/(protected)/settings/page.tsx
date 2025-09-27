// import { AvatarSettings } from '@shared/AvatarSettings';
import { UpdateUserSettingsForm } from '@shared/forms/UpdateUserSettingsForm';
import { SessionsControl } from '@shared/SessionsControl';
import { auth } from 'auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  return (
    <div className='mx-auto flex flex-wrap justify-center gap-4'>
      <UpdateUserSettingsForm />
      <SessionsControl />
      {/* <AvatarSettings /> */}
    </div>
  );
}
