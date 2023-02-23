import { useState, useRef, useEffect } from "react";
import { MenuIcon, SearchIcon, UserCircleIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { HomeIcon , FireIcon, CreditCardIcon } from "@heroicons/react/solid";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../util/firebase';
import { Avatar } from "@material-ui/core";
import { useSession } from "next-auth/react";
import { useUserAuth } from '../../context/UserAuthContext';
import { useDebounce } from '../../hooks/debounceHook';
import { useRouter } from "next/router";
import { DotSpinner } from "@uiball/loaders";
import Sidenav from "../side-nav";
import Profile from "../profile";
import AllActiveClusters from "../all-active-clusters";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();
  const { user, setOpen, open, doesUserExist } = useUserAuth();
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [profile, setProfile] = useState(false);
  const [allActiveClusters, setAllActiveClusters] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) setShowNav(false);
  }, [open]);
  
  
  const changeHandler = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const search = async () => {
    setSuccess(false);
    setFailed(false);
    if(!searchQuery || searchQuery.trim() === '') return;
    setLoading(true);
    try {
      const docRef = await getDoc(doc(db, 'clusters', searchQuery));
      if (docRef.exists()) {
        setLoading(false)
        setSuccess(true)
        return router.push(`/cluster/${searchQuery}`)
      } else {
        setLoading(false)
        setFailed(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false)
      return null
    }
  };

  useDebounce(searchQuery, 500, search);

  return (
    <div className="shadow-sm border-b bg-[#4a5162] text-white sticky top-0 z-40">
      <div className="flex justify-between mx-5">
        <div className="flex items-center justify-center">
          <Link href='/'>
            <div className="relative hidden lg:inline-grid text-4xl text-center font-bold cursor-pointer font-love">
              GangieLevels
            </div>
          </Link>
          <div>
            <MenuIcon
              className="relative -m-2 h-6 cursor-pointer lg:hidden flex-shrink-0"
              onClick={() => setShowNav(!showNav)}
            />
          </div>
        </div>
        <div className="max-w-full pl-20 sm:pl-0">
          <div className="relative mt-1 p-3 rounded-md">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              className="bg-gray-50 block px-10 text-sm border-gray-300 w-56
              rounded-full focus:ring-[#4a5162] focus:border-[#4a5162] text-gray-700"
              type="text"
              placeholder="Paste cluster code"
              ref={inputRef}
              value={searchQuery}
              onChange={changeHandler}
            />
            {isLoading && 
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none" >
                <DotSpinner size={15} color='#FF4501' />
              </div> 
            }
            {success && 
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none" >
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div> 
            }
            {failed && 
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none" >
                <XCircleIcon className="h-5 w-5 text-red-500" />
              </div> 
            }
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 sm:space-x-5 md:space-x-7 lg:space-x-8">
          
          <Link href='/'>
            <HomeIcon className="nav-btn" />
          </Link>
          <Link href='/transactions'>
            <CreditCardIcon className="nav-btn" />
          </Link>
          <FireIcon 
            className="h-6 cursor-pointer text-[#e25822]" 
            onClick={() => setAllActiveClusters(!allActiveClusters)}
          />
          <Avatar
            className="uppercase border-solid border-[1px] cursor-pointer"
            src={session?.user?.image}
            onClick={() => setProfile(!profile)}
          >
            {session?.user.name?.substring(0, 1)}
          </Avatar>
        </div>
      </div>
      <Sidenav
        show={showNav}
        onClickOutside={() => {
          setShowNav(false);
        }}
      />
      {profile && (
        <Profile
          onClickOutside={() => {
            setProfile(false);
          }}
        />
      )}
      {allActiveClusters && (
        <AllActiveClusters 
          onClickOutside={() => {
            setAllActiveClusters(false);
          }}
        />
      )}
    </div>
  );
};

export default Header;
