import { useState, useEffect } from "react";
import { 
  getDocs, 
  collection, 
  query, 
  limit, 
  startAfter, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../util/firebase';
import ActiveClusters from "../active-clusters";
import Cluster from "../cluster";
import MiniProfile from "../mini-profile";
import Skeleton from './skeleton';

async function usersFirstBatch(db) {
  try {
    const data = await getDocs(query(
      collection(db, 'clusters'),
      orderBy('dateCreated', 'desc'),
      limit(30)
    ));
    let clusters = [];
    data.forEach((doc) => {
      clusters.push({
        id: doc.id,
        data: doc.data()
      });
    });
    const lastDoc = data.docs[data.docs.length-1];
    return { clusters, lastDoc };
  } catch (e) {
      console.log(e);
  };
};

async function usersNextBatch(doc, db) {
  try {
    const data = await getDocs(query(
      collection(db, 'clusters'),
      startAfter(doc),
      limit(15)
    ));
    let clusters = [];
    data.forEach((doc) => {
      clusters.push({
        id: doc.id,
        data: doc.data()
      });
    });
    const lastDoc = data.docs[data.docs.length-1];
    return { clusters, lastDoc };
  } catch (e) {
      console.log(e);
  }
}

function Feed() {
  const [clusters, setClusters] = useState(null);
  const [lastDoc, setLastDoc] = useState({});
  const [nextClustersLoading, setNextClustersLoading] = useState(false);
  const skeleton = clusters === null;
  
  useEffect(() => {
    usersFirstBatch(db)
    .then((res) => {
      setClusters(res.clusters);
      setLastDoc(res.lastDoc);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const fetchMoreClusters = (doc) => {
    if (clusters.length > 0 ) {
      setNextClustersLoading(true);
      usersNextBatch(doc, db)
      .then((res) => {
        setLastDoc(res.lastDoc);
        setClusters(clusters.concat(res.clusters));
        setNextClustersLoading(false);
      })
      .catch((err) => {  
        console.log(err);
        setNextClustersLoading(false);
      });
    };
  };

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    console.log(offsetHeight + scrollTop)
    console.log(scrollHeight)
    if (offsetHeight + scrollTop >= scrollHeight) {
      fetchMoreClusters(lastDoc);
    };
  };

  return (
    <main
      className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl
      xl:grid-cols-3 xl:max-w-6xl mx-auto"
    >
      <section className="col-span-2">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 top-2 p-4"
          onScroll={handleScroll}
        >
          {skeleton ? (
            <Skeleton />
          ) : (
            clusters?.map((cluster, index) => (
              <Cluster
                key={index}
                id={cluster.id}
                name={cluster.data.name}
                amount={cluster.data.amount}
              />
            ))
          )}
        </div>
      </section>
      <section className="hidden xl:inline-grid md:col-span-1">
        <div className="fixed top-20">
          <MiniProfile />
          <div className="h-[400px]">
            <ActiveClusters />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Feed;