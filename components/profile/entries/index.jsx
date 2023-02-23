import { useState, useEffect } from "react";
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
import { db } from "../../../util/firebase"
import Entry from "./entry"
import Skeleton from './skeleton';

async function usersFirstBatch(uid, db) {
  try {
    const data = await getDocs(query(
      collection(db, 'entries'),
      where("userId", "==", uid),
      orderBy('dateCreated', 'desc'),
      limit(10)
    ));
    let entries = [];
    data.forEach((doc) => {
    entries.push({
        id: doc.id,
        data: doc.data()
      });
    });
    const lastDoc = data.docs[data.docs.length-1];
    return { entries, lastDoc };
  } catch (e) {
      console.log(e);
  };
};

async function usersNextBatch(doc, uid, db) {
  try {
    const data = await getDocs(query(
      collection(db, 'entries'),
      where("userId", "==", uid),
      startAfter(doc),
      limit(5)
    ));
    let entries = [];
    data.forEach((doc) => {
      entries.push({
        id: doc.id,
        data: doc.data()
      });
    });
    const lastDoc = data.docs[data.docs.length-1];
    return { entries, lastDoc };
  } catch (e) {
      console.log(e);
  };
};

function Entries() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState(null);
  const [lastDoc, setLastDoc] = useState({});
  const [nextEntriesLoading, setNextEntriesLoading] = useState(false);
  const skeleton = entries === null;

  useEffect(() => {
    if (session) {
      usersFirstBatch(session.user.uid, db)
      .then((res) => {
        setEntries(res.entries);
        setLastDoc(res.lastDoc);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

  const fetchMoreEntries = (doc) => {
    if (entries.length > 0 && session) {
      setNextEntriesLoading(true);
      usersNextBatch(doc, session.user.uid, db)
      .then((res) => {
        setLastDoc(res.lastDoc);
        setEntries(entries.concat(res.entries));
        setNextEntriesLoading(false);
      })
      .catch((err) => {  
        console.log(err);
        setNextEntriesLoading(false);
      });
    };
  };

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop >= scrollHeight) {
      fetchMoreEntries(lastDoc);
    }
  };

  return (
    <div 
      onScroll={handleScroll} 
      className='h-[508px] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500'
    >
      {skeleton ? (
        <Skeleton />
      ) : (
        entries.map((entry, index) => (
          <Entry
            key={index}
            name={entry.data.type}
            time={entry.data.dateCreated}
            status={entry.data.paid}
          />
        ))
      )}
    </div>
  )
}

export default Entries;