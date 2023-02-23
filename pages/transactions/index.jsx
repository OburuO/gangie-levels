import { useState, useRef } from "react";
import { useUserAuth } from '../../context/UserAuthContext';
import { useSession } from "next-auth/react";
import Head from "next/head";
import Header from '../../components/header';
import axios from "axios";
import Modal from "../../components/t-modal";
import StateDisplay from "../../components/state-display";

export default function Transactions() {
  const { data: session } = useSession();
  const { 
    doesUserExist,
    setOpen, 
    getUser,
    title,
    description,
    success,
    setTitle,
    setDescription,
    setSuccess  
  } = useUserAuth();
  const depositInputRef = useRef();
  const withdrawalInputRef = useRef();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  async function deposit() {
    if (depositLoading) return;
    const userExists = await doesUserExist(session.user.uid); 
    if (userExists === null) {
      setTitle('Deposit Failed');
      setDescription('You are offline. Please check your connection');
      setSuccess('failed');
      return null;
    };
    if (userExists) {
      setDepositLoading(true)
      const user = await getUser(session.user.uid);
      let amount = depositAmount;
      let number = user.phoneNumber;
      let uid = session.user.uid;
      let data = {
        amount: amount, 
        number: parseMssidn(number), 
        uid: uid
      };
      await axios.post(
        process.env.NEXT_PUBLIC_HOST + '/api/m-pesa/LNM', 
        data
      ).then((res) => {
        if (res.data.ResponseCode == 0) {
          setDepositLoading(false);
          setTitle('Deposit Initiated');
          setDescription('Success. Please check your phone to complete the deposit transaction');
          setSuccess('success');
          if (depositInputRef.current) depositInputRef.current.value = '';
        };
      }).catch((err) => {
        setDepositLoading(false);
        if (err.response) {
          setTitle('Deposit Failed');
          setDescription(err.response.data.message);
          setSuccess('failed');
        } else if (err.request) {
          setTitle('Deposit Failed');
          setDescription('The request failed. Please check your connection and try again');
          setSuccess('failed');
        } else {
          setTitle('Deposit Failed');
          setDescription('Request failed. Something went wrong. Please try again');
          setSuccess('failed');
        };
      });
    } else {
      setOpen(true);
    };
  };

  async function withdraw() {
    if (withdrawalLoading) return;
    const userExists = await doesUserExist(session.user.uid); 
    if (userExists === null) {
      setTitle('Withdrawal Failed');
      setDescription('You are offline. Please check your connection');
      setSuccess('failed');
      return null;
    };
    if (userExists) {
      setWithdrawalLoading(true)
      const user = await getUser(session.user.uid);
      let amount = withdrawalAmount;
      let number = user.phoneNumber;
      let uid = session.user.uid;
      let accountBalance = user.accountBalance;
      let data = {
        amount: amount, 
        number: parseMssidn(number), 
        uid: uid,
        accountBalance: accountBalance
      };
      await axios.post(
        process.env.NEXT_PUBLIC_HOST + '/api/m-pesa/B2C', 
        data
      ).then((res) => {
        if (res.data.ResponseCode == 0) {
          setWithdrawalLoading(false)
          setTitle('Withdrawal Initiated');
          setDescription('Success. Please check your phone to confirm the withdrawal transaction');
          setSuccess('success');
          if (withdrawalInputRef.current) withdrawalInputRef.current.value = '';
        }
      }).catch((err) => {
        setWithdrawalLoading(false)
        if (err.response) {
          setTitle('Withdrawal Failed');
          setDescription(err.response.data.message);
          setSuccess('failed');
        } else if (err.request) {
          setTitle('Withdrawal Failed');
          setDescription('The request failed. Please check your connection and try again');
          setSuccess('failed');
        } else {
          setTitle('Withdrawal Failed');
          setDescription('Request failed. Something went wrong. Please try again');
          setSuccess('failed');
        }
      })
    } else  {
      setOpen(true);
    };
  };
  
  function parseMssidn(n) {
    var strArray = n.split("");
    strArray[0] == "0" ? strArray.splice(0, 1, "254") : (strArray[0] == "+" ? strArray.splice(0,1) : strArray);
    return strArray.join("");
  };

  return (
    <div className='relative bg-gray-50 h-screen scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500'>
      <Head>
        <title>Funds Transaction</title>
      </Head>
      <Header />
      <main
        className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl
        xl:grid-cols-3 xl:max-w-6xl mx-auto"
      >
        <section className="col-span-3 p-4 text-sm">
          <h2 className="text-3xl mb-2 border-b border-gray-400">Deposit using M-Pesa Web Deposit</h2>
          <ul className="list-disc ml-5">
            <li>Before you can place an entry you firstly need to deposit money into your account.</li>
            <li>The number that you've registered with M-Pesa and Gangie Levels should be the same.</li>
            <li>Minimum Deposit: Ksh 1 | Maximum Deposit: Ksh 70,000</li>
          </ul>
          <input
            className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 mt-5 
            rounded-md focus:ring-[#37003c] focus:border-[#37003c] text-gray-700"
            type="text"
            placeholder="Enter the amount you wish to deposit"
            onChange={e => setDepositAmount(e.target.value)}
            ref={depositInputRef}
          />
          <button 
            disabled = { !depositAmount || depositLoading }
            className="inline-flex justify-center w-full rounded-md mt-3 border border-transparent shadow-sm
            py-2 bg-teal-400 text-base font-medium text-white hover:bg-teal-700 focus:outline-none
            sm:text-sm disabled:bg-gray-300  disabled:hover:bg-gray-300 cursor-pointer"
            onClick={deposit}
          >
            {depositLoading ? 'processing...' : 'DEPOSIT'}
          </button>
          <h2 className="text-3xl mt-10 mb-2 border-b border-gray-400">Withdraw to your M-Pesa Account</h2>
          <ul className="list-disc ml-5">
            <li>Making a withdrawal is easy. Just enter the details and then click WITHDRAW.</li>
            <li>Minimum Withdrawal: 100 | Maximum Withdrawal: 150,000</li>
          </ul>
          <input
            className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 mt-5 
            rounded-md focus:ring-[#37003c] focus:border-[#37003c] text-gray-700"
            type="text"
            placeholder="Enter the amount you wish to withdraw"
            onChange={e => setWithdrawalAmount(e.target.value)}
            ref={withdrawalInputRef}
          />
          <button 
            disabled={ !withdrawalAmount || withdrawalLoading }
            type="button"
            className="inline-flex justify-center w-full rounded-md mt-3 border border-transparent shadow-sm
            py-2 bg-teal-400 text-base font-medium text-white hover:bg-teal-700 focus:outline-none
            sm:text-sm disabled:bg-gray-300  disabled:hover:bg-gray-300"
            onClick={withdraw}
          >
            {withdrawalLoading ? 'processing...' : 'WITHDRAW'}
          </button>
        </section>
        <Modal />
      </main>
      <StateDisplay visible={ title !== null && description !== null && success !== null}/>
    </div>
  );
};