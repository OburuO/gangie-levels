import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { collection, doc, onSnapshot, query, where, limit, getDoc, orderBy } from "firebase/firestore";
import { db } from "../util/firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [open, setOpen] = useState(false);

  //State display
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {  
    if (session) {
      onSnapshot(
        doc(db, 'users', session.user.uid), 
        (snapshot) => setUser(snapshot.data()),
      );
    };
  }, [session]);

  useEffect(() => {  
    if (session) {
      onSnapshot(
        query(
          collection(db, 'clusters'),
          where("users", "array-contains", session.user.uid),
          orderBy('dateCreated', 'desc'),
          limit(9)
        ),
        (snapshot) => {
          setClusters(snapshot.docs)
        }
      );
    };
  }, [session]);

  async function doesUserExist(uid) {
    try {
      const docRef = await getDoc(doc(db, 'users', uid));
      return docRef.exists();
    } catch (error) {
      return null
    }
  };

  async function getUser(uid) {
    const docRef = await getDoc(doc(db, 'users', uid));
    return docRef.data(); 
  };
  
  return (
    <userAuthContext.Provider
      value={{
        user,
        clusters,
        open,
        setOpen, 
        doesUserExist,
        getUser,
        title,
        description,
        success,
        setTitle,
        setDescription,
        setSuccess
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useContext(userAuthContext);
};
