'use client';

import { useEffect, useRef } from 'react';

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Dialog = ({ open, onClose, children }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={`bg-card text-white shadow-lg outline-none backdrop:bg-background/90 open:flex
        open:items-center open:justify-center max-sm:m-0 max-sm:h-screen max-sm:w-screen
        max-sm:rounded-none sm:max-h-[600px] sm:max-w-[400px] sm:rounded-md sm:p-1`}
    >
      <div ref={overlayRef} className='size-full overflow-auto p-4'>
        {children}
      </div>
    </dialog>
  );
};
