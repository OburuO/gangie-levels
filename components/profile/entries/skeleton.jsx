function Skeleton() {
  const COUNTER = 9;
  const Loader = () => (
    <div 
      className='flex items-center  space-x-5 bg-gray-100 px-4 py-2 mx-1 rounded-md mb-2
      animate-pulse'
    >
      <div className="border h-4 w-4 rounded-full bg-gray-400" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-20 bg-gray-400 rounded-full" />
        <div className="h-3 w-10 bg-gray-400 rounded-full" />
      </div>
      <div className="border h-7 w-7 rounded-full bg-gray-400" />
    </div>
  )
  return Array(COUNTER).fill(<Loader />);
};

export default Skeleton;