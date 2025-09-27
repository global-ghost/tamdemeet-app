import { useCallback, useState } from 'react';

export const useToggle = (defaultValue: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const toggle = useCallback(() => {
    setIsOpen((state) => !state);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close: handleClose, open: handleOpen, toggle };
};
