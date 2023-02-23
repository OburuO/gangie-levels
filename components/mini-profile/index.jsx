import { Avatar } from "@material-ui/core";
import { signOut, useSession } from "next-auth/react";


function MiniProfile() {
  const { data: session } = useSession();
  
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <Avatar
        className="uppercase border-solid border-[1px]"
        src={session?.user?.image}
        alt=""
      >
        {session?.user?.name?.substring(0, 1)}
      </Avatar>
      <div className="flex-1 mx-6">
        {session && <h2 className="font-bold -mb-1">{session?.user?.name?.split(" ").join("").toLocaleLowerCase()}</h2>}
        {!session && <div className="h-4 bg-gray-100 w-full rounded-full" />}
        <h3 className="text-sm text-gray-400 -mt-1">welcome to GangieLevels</h3>
      </div>
      <button onClick={() => signOut()}  className="text-blue-400 text-sm font-semibold">sign out</button>
    </div>
  );
};

export default MiniProfile;
