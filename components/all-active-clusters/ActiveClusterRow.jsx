import Link from 'next/link';
import { FireIcon } from "@heroicons/react/solid";

function ActiveClusterRow({ id, type, color }) {
  return (
    <div className="flex items-center space-x-2 py-2 border-t">
      <FireIcon style={{color: color}} className='h-4 m-1' />
      <div className='text-gray-600 text-sm'>
        <p className='text-xs font-semibold'>{type} Cluster</p>
        <p className='w-[200px] truncate'>@{id}</p>
      </div>
      <Link href={`/cluster/${id}`}>
        <div className='cursor-pointer rounded-full px-2 py-1 bg-blue-500 text-white text-xs'>
          View
        </div>
      </Link>
    </div>
  );
};

export default ActiveClusterRow;