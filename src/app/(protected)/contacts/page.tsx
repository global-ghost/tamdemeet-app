import { FriendRequestForm } from '@shared/forms/FriendRequestForm';
import { FreindRequestList } from '@shared/FriendRequestList';
import { auth } from 'auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  return (
    <div className='flex flex-wrap justify-center gap-[10px]'>
      <FreindRequestList />
      <FriendRequestForm />
    </div>
  );
}
