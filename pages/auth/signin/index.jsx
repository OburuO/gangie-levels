import { 
  getProviders, 
  signIn as SignIntoProvider,  
} from "next-auth/react";
import Head from 'next/head';

export default function SignIn({ providers }) {
  console.log('Providers' + providers);
  
  return (
    <div className="items-center justify-center bg-gray-50 h-screen scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
      <Head>
        <title>Enter the Levels</title>
      </Head>
      <div 
        className="flex flex-col items-center justify-center"
      >
        <div className="text-center w-96">
          <p className='font-love font-extrabold my-4 text-5xl cursor-pointer'>GangieLevels</p>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button 
                className="w-full font-bold text-lg text-white py-2 bg-[#0074b1] rounded-full" 
                onClick={() => SignIntoProvider(provider.id, {callbackUrl: "/"})}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders(context);
  return {
    props: { 
      providers,
    },
  };
};
