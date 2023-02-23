import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../util/firebase';
import Head from "next/head";
import ActiveClusters from "../../components/active-clusters";
import MiniProfile from "../../components/mini-profile";
import DetailedCluster from "../../components/detailed-cluster";
import Modal from "../../components/modal";
import Header from '../../components/header';
import RegistrationModal from "../../components/t-modal";

export default function Cluster({ data }) {
  const name = JSON.parse(data)
  return (
    <div className='bg-gray-50 h-screen scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500'>
      <Head>
        <title>{name?.name + ' ' + 'Cluster'}</title>
      </Head>
      <Header />
      <main
        className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl
        xl:grid-cols-3 xl:max-w-6xl mx-auto"
      >
        <section className="col-span-2">
          <DetailedCluster sdata={data} />
        </section>
        <section className="hidden xl:inline-grid md:col-span-1">
        <div className="fixed top-20">
          <MiniProfile />
          <div className="h-[400px]">
            <ActiveClusters />
          </div>
        </div>
      </section>
      <Modal />
      <RegistrationModal />
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const docRef = doc(db, 'clusters', context.query.id);
    const dataRes = await getDoc(docRef);
    
    const data = {
      id: dataRes.id,
      ...dataRes.data(),
    };
    console.log(data)
    return {
      props: {
        data: JSON.stringify(data),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    }
  }
};
