import Head from 'next/head';
import Feed from '../components/feed';
import Header from '../components/header';
import Modal from "../components/t-modal";

export default function() {
  return (
    <div className='bg-gray-50 h-screen scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500'>
      <Head>
        <title>Gangie Levels</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Feed />
      <Modal />
    </div>
  );
};