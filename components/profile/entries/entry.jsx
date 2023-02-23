import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import TimeAgo from 'timeago-react';

function Entry({name, time, status}) {
  return (
    <div className="flex items-center space-x-5 bg-white px-4 py-2 text-xs border-solid 
    border-[1px] border-gray-200 mx-1 rounded-md mb-2">
      <div>
        {status && <div className="border h-4 w-4 rounded-full bg-teal-900" />}
        {!status && <div className="border h-4 w-4 rounded-full bg-gray-400" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-[12px] text-gray-400">
          <TimeAgo datetime={time.toDate()} />
        </p>
      </div>
      <div className="items-center justify-center">
        {status && <CheckCircleIcon className="h-6 text-teal-900"/>}
        {!status && <XCircleIcon className="h-6 text-gray-400"/>}
      </div>
    </div>
  );
};

export default Entry;