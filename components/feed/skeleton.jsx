function Skeleton() {
  const COUNTER = 20;
  const Loader = () => (
    <div 
      className='relative  max-w-full rounded-md animate-pulse bg-gray-100 h-[116px]'
    >
      <div className="flex flex-col items-center p-3 space-y-3">
        <div className="h-8 w-8 rounded-full bg-gray-400"/>
        <div className="h-[13px] w-8/12 bg-gray-400 rounded-full"/>
        <div className="mt-3 h-6 w-full bg-gray-400 rounded-full"/>
      </div>
    </div>
  )
  return Array(COUNTER).fill(<Loader />);
};

export default Skeleton;