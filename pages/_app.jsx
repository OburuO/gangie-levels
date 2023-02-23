import '../styles/globals.css';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react'
import { store } from '../store';
import { UserAuthContextProvider } from "../context/UserAuthContext";
import { Love_Light } from '@next/font/google'

const love = Love_Light({
  variable: '--font-love',
  weight: '400',
  subsets: ['latin']
});

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <UserAuthContextProvider>
          <main className={`${love.variable}`}>
            <Component {...pageProps} />
          </main>
        </UserAuthContextProvider>
      </SessionProvider>
    </Provider>
  );
};

export default MyApp;
