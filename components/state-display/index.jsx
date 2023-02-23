import {  useEffect } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

function StateDisplay({ visible }) {
  const {  
    title,
    description,
    success,
    setTitle,
    setDescription,
    setSuccess 
  } = useUserAuth();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setTitle(null)
        setDescription(null)
        setSuccess(null)
      }, 10000)
    }
  }, [visible])

  return (
    <div 
      className={`absolute rounded-md p-2 bg-[#23313d] top-4 z-50 left-0 right-0 w-[98%] sm:w-80  mx-auto`}
      style={{ 
        display: visible ? "block" : "none",
        color: success === 'success' ? 'green' : 'red'
      }}
    >
      <div className="flex items-center space-x-2">
        {success === 'success' ? <CheckCircleIcon className="h-8" /> : <XCircleIcon className="h-8" />}
        <div>
          <h2 className='font-bold'>{title}</h2>
          <p className='text-xs'>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StateDisplay;