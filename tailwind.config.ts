export const tailwindConfig = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      lightWhite: '#ebebeb',
      primary: '#b6d8ff',
      primaryLight: '#d6e9ff',
      secondary: '#b6ffe0',
      secondaryDark: '#173A2B',
      error: '#ff848b',
      errorDark: '#1c1b22',
      warning: '#D6CA80',
      warningDark: '#5C552D',
      disabled: '#545454',
      white: '#fff',
      transparent: 'transparent',
      gray: '#bababa',
      background: '#101519',
      card: '#191E22',
      cardBorder: '#22272a',
      navbar: '#0b0e11',
      inherit: 'inherit',
    },
  },

  plugins: [],
} as const;
export default tailwindConfig;
