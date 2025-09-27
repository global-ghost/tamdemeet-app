'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Card } from '@components/ui';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { updateUserSettings } from 'actions/user/updateAvatar';
import { useSession } from 'next-auth/react';

export const DEFAULT_AVATAR_SRC = 'https://i.postimg.cc/4yn3dwLy/1.png';
export const DEFAULT_EVENT_SRC =
  'https://i.postimg.cc/CLwqSp1m/istockphoto-1172489050-612x612.jpg';

const avatars = [
  DEFAULT_AVATAR_SRC,
  'https://i.postimg.cc/NFVjrTS4/2.png',
  'https://i.postimg.cc/wxbvP8Mm/3.png',
  'https://i.postimg.cc/vHgBwqxS/4.png',
  'https://i.postimg.cc/Yq5Sr612/5.png',
  'https://i.postimg.cc/kgWgB2cQ/6.png',
];

export const AvatarSettings = () => {
  const { data, update } = useSession();
  const user = data?.user;
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.image ?? avatars[0],
  );

  const handleUpdateAvatar = useCallback(async () => {
    await handleAction(
      () => updateUserSettings(selectedAvatar),
      enqueueReponseError,
      enqueueResponseMessage,
    );
    update();
  }, [selectedAvatar, update]);

  useEffect(() => {
    setSelectedAvatar(user?.image ?? avatars[0]);
  }, [user]);

  return (
    <Card className='w-full lg:w-[400px] '>
      <p className='mb-4 text-center text-3xl'>Avatar</p>
      <div className='flex flex-wrap justify-center gap-[10px]'>
        {avatars.map((src, index) => {
          return (
            <button
              onClick={() => setSelectedAvatar(src)}
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
              }}
              key={index}
              className={`size-[72px] rounded-full ${
                src === selectedAvatar ? 'grayscale-0 ' : 'grayscale'
              }`}
            />
          );
        })}
      </div>

      <Button
        title='Update'
        className='mt-[30px] w-full'
        onClick={handleUpdateAvatar}
      />
    </Card>
  );
};
