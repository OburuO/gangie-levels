import Link from 'next/link'
function InfoNav() {
  const date = new Date();

  return (
    <div>
      <div className="relative flex items-start justify-start space-x-1 text-gray-400 text-xs">
        <Link href='/@info/terms'>
          <p className="cursor-pointer">terms</p>
        </Link>
        <Link href='/@info/privacy'>
          <p className="cursor-pointer">privacy</p>
        </Link>
      </div>
      <p className="text-sm mt-1 text-gray-400">© {date.getFullYear()} gangielevels.com</p>
    </div>
  );
};

export default InfoNav;