function Skeleton() {
  const COUNTER = 10;
  const Loader = () => (
    <div 
      className='flex items-center  space-x-2 bg-gray-100 py-2 px-1 rounded-md mb-1
      animate-pulse'
    >
      <div className="border h-4 w-4 rounded-full bg-gray-400" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-20 bg-gray-400 rounded-full" />
        <div className="h-4 w-[124px] bg-gray-400 rounded-full" />
      </div>
      <div className="border h-4 w-10 py-3 rounded-full bg-gray-400" />
    </div>
  )
  return Array(COUNTER).fill(<Loader />);
};

export default Skeleton;