import { tailwindConfig } from 'tailwind.config';

export const colors = tailwindConfig.theme.colors;
export type Color = keyof typeof colors;
