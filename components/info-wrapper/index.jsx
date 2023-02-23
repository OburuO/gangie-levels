import Head from "next/head";

function InfoWrapper({ title, children }) {
  return (
    <div className='bg-gray-50 h-screen scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500'>
      <Head>
        <title>{title}</title>
      </Head>
      <div 
        className='text-center shadow-sm border-b bg-white sticky top-0 z-40
        text-4xl font-light py-4'
      >
        {title}
      </div>
      <div className="xl:max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default InfoWrapper;