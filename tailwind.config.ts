import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poor: 'var(--poor-text)',
        flower: 'var(--flower-text)',
      },
      backgroundColor: {
        lightYellow: '#ffe77a',
      },
      margin: {
        tomato: '120px',
      },
      borderRadius: {
        'sexy-name': '11.11px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

//이렇게 새로운 tailwind className을 생성하게 되었음. (fontFamily) -> 각각의 className들은 각각의 -text라는 변수를 가리키고 있음.
