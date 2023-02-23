import { useState } from 'react';
import { Avatar } from "@material-ui/core";
import { useOnClickOutside } from "../../hooks/onClickOutsideHook";
import { useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Switch } from '@headlessui/react'
import { LogoutIcon } from '@heroicons/react/outline';
import { useUserAuth } from '../../context/UserAuthContext';
import Entries from "./entries";

function Profile({ onClickOutside }) {
  const ref = useRef();
  const { data: session } = useSession();
  const { user } = useUserAuth();
  const [enabled, setEnabled] = useState(false);
  
  useOnClickOutside(ref, () => onClickOutside());

  return (
    <div
      ref={ref}
      className="absolute right-5 top-14 w-[296px] border-solid border-[1px]
      border-gray-200 rounded-md bg-gray-50 text-black pb-4 h-[680px] shadow-sm"
    >
      <div className="sticky top-0 z-50">
        <div className="flex flex-col items-center pb-[10px]">
          <div className="-mb-5 w-full h-12 rounded-t-md bg-gray-200 flex justify-between">
            <div className='flex'>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${
                  enabled ? 'bg-teal-900' : 'bg-gray-500'
                } relative inline-flex h-6 w-11 items-center rounded-full m-2`}
              >
                <span className="sr-only">Enable notifications</span>
                <span
                  className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              {enabled &&
                <span className="text-[13px] text-gray-800 font-extrabold w-[120px] truncate m-2">
                  Ksh.{user?.accountBalance}
                </span>
              }
            </div>
            <LogoutIcon className='h-5 m-2 cursor-pointer' onClick={() => signOut()} />
          </div>
          <Avatar 
            className="uppercase" 
            src={session?.user?.image}
          >
            {session?.user?.name?.substring(0, 1)}
          </Avatar>
          <h2 className="text-[20px] font-bold">{session?.user?.name}</h2>
          <h4 className="text-gray-500 text-sm">{session?.user?.email}</h4>
          <div className="flex">
            
          </div>
          <div className="text-xl text-gray-900 font-semibold text-center mt-2">
            Your Entry History
          </div>
        </div>
      </div>
      <div className="overflow-x-hidden">
        <Entries />
      </div>
    </div>
  );
};

export default Profile;
