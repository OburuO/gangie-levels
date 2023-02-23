import { useEffect, useState, useRef } from 'react';
import { useOnClickOutside } from "../../hooks/onClickOutsideHook";
import { useSession } from "next-auth/react";
import { 
  getDocs, 
  collection, 
  query, 
  where, 
  limit, 
  startAfter, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../util/firebase';
import { clusterColorDeterminant } from '../cluster'
import ActiveClusterRow from './ActiveClusterRow';
import Skeleton from './skeleton';

 async function usersFirstBatch(uid, db) {
  try {
    const data = await getDocs(query(
      collection(db, 'clusters'),
      where("users", "array-contains", uid),
      orderBy('dateCreated', 'desc'),
      limit(10)
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

async function usersNextBatch(doc, uid, db) {
  try {
    const data = await getDocs(query(
      collection(db, 'clusters'),
      where("users", "array-contains", uid),
      startAfter(doc),
      limit(5)
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

function AllActiveClusters({ onClickOutside }) {
  const ref = useRef();
  const { data: session } = useSession();
  const [clusters, setClusters] = useState(null);
  const [lastDoc, setLastDoc] = useState({});
  const [nextClustersLoading, setNextClustersLoading] = useState(false);
  const skeleton = clusters === null;

  useOnClickOutside(ref, () => onClickOutside());

  useEffect(() => {
    if (session) {
      usersFirstBatch(session.user.uid, db)
      .then((res) => {
        setClusters(res.clusters);
        setLastDoc(res.lastDoc);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

  const fetchMoreClusters = (doc) => {
    if (clusters.length > 0 && session) {
      setNextClustersLoading(true);
      usersNextBatch(doc, session.user.uid, db)
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
    if (offsetHeight + scrollTop >= scrollHeight) {
      fetchMoreClusters(lastDoc);
    };
  };

  return (
    <div
      ref={ref}
      className="absolute right-5 top-14 w-[296px] border-solid border-[1px]
      border-gray-200 rounded-md bg-gray-50 text-black pb-4 h-[680px]"
    >
      <div className='sticky top-0 z-50 p-2 '>
        <h2 className="text-xl font-semibold text-center">All Active Clusters</h2>
      </div>
      <div 
        className='overflow-y-scroll h-[616px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500' 
        onScroll={handleScroll}
      >
        {skeleton ? (
          <Skeleton />
        ) : (
          clusters?.map((entry, index) => (
            <ActiveClusterRow 
              key={index}
              id={entry.id}
              type={entry.data.name}
              color={clusterColorDeterminant(entry.data.name)}
            />
          ))
        )}
      </div>   
      <div>
      </div>  
    </div>
  )
}

export default AllActiveClusters;