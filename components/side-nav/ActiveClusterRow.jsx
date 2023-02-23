import Link from 'next/link';

function ActiveClusterRow({ id, type, index }) {
  return (
    <div className="flex items-center bg-gray-500 space-x-2 py-2 rounded-md mb-1 mx-1">
      <p className='pl-2 text-gray-900 font-bold'>{index + 1}.</p>
      <div className='text-gray-900 text-sm'>
        <p className='text-xs text-gray-400 font-semibold'>{type} Cluster</p>
        <p className='w-[124px] truncate'>@{id}</p>
      </div>
      <Link href={`/cluster/${id}`}>
        <div className='cursor-pointer rounded-full px-2 py-1 bg-blue-500 text-white text-[10px]'>
          View
        </div>
      </Link>
    </div>
  );
};

export default ActiveClusterRow;