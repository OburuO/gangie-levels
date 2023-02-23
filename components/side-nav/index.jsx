import { useRef } from "react";
import {
  XIcon,
  HomeIcon,
  CreditCardIcon,
} from "@heroicons/react/solid";
import { useOnClickOutside } from "../../hooks/onClickOutsideHook";
import { useUserAuth } from '../../context/UserAuthContext';
import { useRouter } from "next/router";
import ActiveClusterRow from './ActiveClusterRow';
import Link from 'next/link';
import Skeleton from './skeleton';
import InfoNav from '../info-nav';

function Sidenav({ show, onClickOutside }) {
  const ref = useRef();
  const router = useRouter();
  useOnClickOutside(ref, () => onClickOutside());
  const { clusters, user, setOpen } = useUserAuth();
  const skeleton = clusters === null;

  return (
    <div
      className={`absolute bg-[#4a5162] w-56 z-50 top-0
      transition-all duration-150 ease-out h-screen
      lg:hidden ${show ? "active:left-0" : "left-[-100%]"}`}
      ref={ref}
    >
      <div className="sticky">
        <div className="ml-3 flex items-center h-[66px]">
          <XIcon
            className="h-6 cursor-pointer text-white"
            onClick={() => onClickOutside()}
          />
          <Link href='/'>
            <div className="ml-[10px] text-white text-4xl text-center font-bold font-love cursor-pointer">
              GangieLevels
            </div>
          </Link>
        </div>       
        <div className="border-b border-gray-500"/>
        <div className="text-white bg-[#4a5162]">
          <div 
            className="flex items-center pl-[2px] cursor-pointer hover:opacity-90 ml-2 space-x-3"
            onClick={() => {
              router.push('/');
            }}
          >
            <HomeIcon className="h-6" />
            <h3 className="font-medium text-[12px]">Home</h3>
          </div> 
          <div className="border-b border-gray-500"/>
          <div 
            className="flex items-center pl-[2px] cursor-pointer hover:opacity-90 ml-2 space-x-3"
            onClick={() => {
              router.push('/transactions');
            }}
          >
            <CreditCardIcon className="h-6" />
            <h3 className="font-medium text-[12px]">Funds Transaction</h3>
          </div>          
        </div>
        <div className="border-b border-gray-500"/>
        <div className="h-fit  mt-2 bg-transparent mx-1 rounded-md">
          <div className="pb-1">
            <p className="text-xl font-thin text-gray-300 text-center mx-4">Your Active Clusters</p>
          </div>
          <div className="h-[532px]">
          {skeleton ? (
              <Skeleton />
            ) : (
              clusters?.map((cluster, i) => (
                <ActiveClusterRow 
                  key={cluster.id}
                  id={cluster.id}
                  type={cluster.data().name}
                  index={i}
                />
              ))
            )}
          </div>
        </div> 
        <div className="m-2">
          <InfoNav />
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
