import React from 'react';
import { GoogleButton } from './GoogleButton';

export const GoogleAuthView = () => (
  <React.Fragment>
    <div className='relative my-4 h-7'>
      <div className='absolute mt-3 w-full border border-disabled'></div>
      <div className='absolute flex w-full justify-center'>
        <div className='w-8 bg-card text-center'>OR</div>
      </div>
    </div>

    <GoogleButton />
  </React.Fragment>
);
