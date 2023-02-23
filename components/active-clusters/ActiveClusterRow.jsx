import Link from 'next/link';

function ActiveClusterRow({ id, type, index }) {
  return (
    <div className="flex items-center space-x-2 border-t px-4 py-2
    last:rounded-b ">
      <p className='font-bold text-gray-900'>{index + 1}.</p>
      <div className='text-gray-600 text-sm'>
        <p className='text-xs text-gray-400 font-semibold'>{type} Cluster</p>
        <p className='w-[196px] text-gray-900 truncate'>@{id}</p>
      </div>
      <Link href={`/cluster/${id}`}>
        <div className='cursor-pointer rounded-full py-1 px-2 bg-blue-500 text-white text-xs'>
          View
        </div>
      </Link>
    </div>
  );
};

export default ActiveClusterRow;