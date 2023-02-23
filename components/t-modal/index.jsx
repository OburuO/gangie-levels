import { useState, Fragment, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useUserAuth } from '../../context/UserAuthContext';
import { auth } from "../../util/firebase";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../util/firebase";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

function Modal() {
  const { data: session } = useSession();
  const { open, setOpen } = useUserAuth();
  const numberRef = useRef();
  const otpRef = useRef();
  const [error, setError] = useState(false);
  const [number, setNumber] = useState("");
  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    await recaptchaVerifier.render();
    return await signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  function parseMssidn(n) {
    var strArray = n.split("");
    strArray[0] == "0" ? strArray.splice(0, 1, "254") : (strArray[0] == "+" ? strArray.splice(0,1) : strArray);
    return strArray.join("");
  }

  const getOtp = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const regExPattern = /^(?:254|\+254|0)?((?:(?:7(?:(?:[01249][0-9])|(?:5[789])|(?:6[89])))|(?:1(?:[1][0-5])))[0-9]{6})$/;
    const isNumberValid = regExPattern.test(number);
    if(isNumberValid) {
      let data = parseMssidn(number);
      data = '+' + data
      try {
        const response = await setUpRecaptcha(data);
        setResult(response);
        setLoading(false);
        if (numberRef.current) numberRef.current.value = '';
        setFlag(true);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    } else {
      setLoading(false);
      setError(true)
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp)
      .then(async(userCredential) => {
        await setDoc(
          doc(db, 'users', session.user.uid), {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            phoneNumber: userCredential.user.phoneNumber,
            accountBalance: 0,
            eventId: null,
            dateCreated: serverTimestamp()
          }
        )
      });
      setTimeout(() => {
        auth.signOut()
        console.log('user signed out')
      }, 1000);
      setLoading(false);
      setSuccess(true);
      if (otpRef.current) otpRef.current.value = '';     
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          setFlag(false);
          setOpen(false);
          setNumber("");
          setOtp("");
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
              className="inline-block align-bottom bg-[#4a5162]  rounded-md text-left w-full p-5 mx-2
              overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full 
              sm:p-6"
            >
              <form className='flex flex-col py-3' onSubmit={getOtp} style={{ display: !flag ? "block" : "none" }}>
                <p className="text-sm p-2 bg-gray-100 rounded-md mb-5 text-gray-600">
                  Please enter your phone number for registration to the Gangie Levels 
                  then press the button below to send verification code to your phone.
                </p>
                <input
                  placeholder='Enter Phone Number'
                  type='text'
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  ref={numberRef}
                  className='bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 
                  rounded-md focus:ring-[#37003c] focus:border-[#37003c] text-gray-700'
                />
                <button 
                  disabled={!number || loading}
                  type="submit"
                  className='inline-flex justify-center w-full rounded-md mt-2 border border-transparent shadow-sm
                  py-2 bg-red-400 text-base font-medium text-white hover:bg-red-700 focus:outline-none
                  sm:text-sm disabled:bg-gray-300  disabled:hover:bg-gray-300'
                >
                  {loading ? 'sending...' : 'Send Verification Code'}
                </button>
                <div className='mt-4' id="recaptcha-container"/> 
                {error && 
                  <div className="flex flex-col mx-2 rounded-md bg-white">
                    <div className="flex items-center space-x-2 p-1">
                      <XCircleIcon className="text-red-500 h-6" />
                      <h1 className="text-xs text-red-500">unsuccessful. An error occurred. Please check your connection and ensure the phone number is valid.</h1>
                    </div>
                  </div>
                }
              </form> 
              <form className='flex flex-col py-3' onSubmit={verifyOtp} style={{ display: flag ? "block" : "none" }}>
                <p className="text-sm p-2 bg-gray-100 rounded-md mb-5 text-gray-600">
                  Enter the verification code sent to your mobile phone to verify yourself and complete registration.
                </p>
                <input
                  placeholder='Enter OTP Verification Code'
                  type='text'
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  ref={otpRef}
                  className='bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300
                  rounded-md focus:ring-[#37003c] focus:border-[#37003c] text-gray-700'
                />
                <button 
                  disabled={!otp || loading}
                  type="submit"
                  className='inline-flex justify-center w-full rounded-md mt-2 border border-transparent shadow-sm
                  py-2 bg-red-400 text-base font-medium text-white hover:bg-red-700 focus:outline-none
                  sm:text-sm disabled:bg-gray-300  disabled:hover:bg-gray-300'
                >
                  {loading ? 'processing...' : 'Verify Phone Number'}
                </button>
                {success && 
                  <div className="flex flex-col p-5 mx-2 rounded-md bg-white mt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="text-green-500 h-12 " />
                      <h1 className="text-xl">success, your registration has been confirmed...</h1>
                    </div>
                  </div>
                }
                {error && 
                  <div className="flex flex-col mx-2 rounded-md bg-white mt-4">
                    <div className="flex items-center space-x-2 p-1">
                      <XCircleIcon className="text-red-500 h-6 " />
                      <h1 className="text-xs text-red-500">unsuccessful. An error occurred. Please check your connection and ensure the verification code is valid.</h1>
                    </div>
                  </div>
                }
              </form>
              <div 
                className="absolute bottom-2 right-4 bg-red-400 text-white uppercase py-[2px] font-semibold 
                rounded-md px-3 text-[10px] cursor-pointer"
                onClick={() => {
                  setFlag(false);
                  setOpen(false);
                  setNumber("");
                  setOtp("");
                  setError(false);
                  setSuccess(false)
                  setLoading(false);
                }}
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
