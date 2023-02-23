import { useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { unset, selectPosition } from "../../slices/position-slice";
import { Dialog, Transition } from "@headlessui/react";
import {
  collection,
  doc,
  addDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../util/firebase";
import { useRouter } from "next/router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { ThreeBody } from "@uiball/loaders";

const positionNameDeterminant = (type) => {
  let result;
  switch (type) {
    case "inviteStageA":
      result = "invite stage A";
      break;
    case "inviteStageB":
      result = "invite stage B";
      break;
    case "inviteStageC":
      result = "invite stage C";
      break;
    case "inviteStageD":
      result = "invite stage D";
      break;
    case "inviteStageE":
      result = "invite stage E";
      break;
    case "inviteStageF":
      result = "invite stage F";
      break;
    case "inviteStageG":
      result = "invite stage G";
      break;
    case "inviteStageH":
      result = "invite stage H";
      break;
    default:
      result = null;
      break;
  }
  return result;
};

function Modal() {
  const { data: session } = useSession();
  const user = session?.user;
  const position = useSelector(selectPosition);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const position_name = positionNameDeterminant(position?.position);


  const joinCluster = async () => {
    setError(false);

    if (loading) return;

    setLoading(true);

    const docRef = doc(db, "clusters", router.query.id);
    
    try {
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef);
        const isjoined = doc.data()[position.position].joined;
        const users = doc.data().users;
        users.push(user.uid);
        if (isjoined == false) {
          const entryRef = await addDoc(
            collection(db, "entries"), {
              userId: user.uid,
              type: position.type,
              username: user.name,
              usrImg: user.image,
              joined: true,
              paid: false,
              dateCreated: serverTimestamp(),
            }
          );
          let qty = {
            eid: entryRef.id,
            userId: user.uid,
            username: user.name,
            usrImg: user.image,
            joined: true,
            paid: false,
          };
          let variable = position.position;
          var values = {};
          values[variable] = qty;
          values["users"] = users;
          transaction.update(docRef, values);
          // check circle checked
          setLoading(false)
          setSuccess(true)
        } else {
          setLoading(false)
          setMessage(true);
        }
      });
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setError(true);
    };
  };

  return (
    <Transition.Root show={position.show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          dispatch(unset());
          setMessage(false);
          setError(false);
          setSuccess(false)
          setLoading(false);
        }}
      >
        <div
          className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center
          sm:block sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/** This element is to trick the browser into centering the modal contents.*/}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-[#4a5162] rounded-md text-left mx-2
              overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full 
              sm:p-6"
            >
              
              <p className="absolute top-2 right-2 w-40 text-xs text-gray-900 truncate">
                <span className="font-bold text-sm">Cluster</span> @{position.id}
              </p>

              <div className="flex flex-col items-center my-10 mx-2 sm:mt-3">
                <p className="text-sm p-2 bg-gray-100 rounded-md mb-5 text-gray-600">
                  You are about to enter {position.type} cluster 
                  with {position_name} position. Kindly press{' '}  
                  Join the Cluster button to continue.
                </p>
                <button 
                  disabled={loading || error || success || message}
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm
                  py-2 bg-red-400 text-base font-medium text-white hover:bg-red-700 focus:outline-none
                  sm:text-sm disabled:bg-gray-300  disabled:hover:bg-gray-300"
                  onClick={joinCluster}
                >
                  Join the Cluster
                </button>
              </div>
              <div className="mb-10">
                {loading && 
                  <div className="text-center">
                    <ThreeBody size={50} color='teal' />
                  </div>
                }
                {success && 
                  <div className="flex flex-col p-5 mx-2 rounded-md bg-white">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="text-green-500 h-12 " />
                      <h1 className="text-2xl">thank you, your entry has been confirmed...</h1>
                    </div>
                  </div>
                }
                {message && 
                  <div className="flex flex-col p-5 mx-2 rounded-md bg-white">
                    <div className="flex items-center space-x-2">
                      <XCircleIcon className="text-red-500 h-12 " />
                      <h1 className="text-2xl">unsuccessful. The entry is booked. Please try again with another entry</h1>
                    </div>
                  </div>
                }
                {error && 
                  <div className="flex flex-col p-5 mx-2 rounded-md bg-white">
                    <div className="flex items-center space-x-2">
                      <XCircleIcon className="text-red-500 h-12 " />
                      <h1 className="text-2xl">unsuccessful. An error occurred. Please check your connection and try again</h1>
                    </div>
                  </div>
                }
              </div>
              <div 
                className="absolute bottom-2 right-4 bg-red-400 text-white uppercase py-[2px] font-semibold 
                rounded-md px-3 text-[10px] cursor-pointer"
                onClick={
                  () => {
                    dispatch(unset());
                    setMessage(false);
                    setError(false);
                    setSuccess(false)
                    setLoading(false);
                  }
                }
              >
                close
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
