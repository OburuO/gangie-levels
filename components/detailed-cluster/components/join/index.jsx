import { Avatar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { set } from "../../../../slices/position-slice";
import { useUserAuth } from '../../../../context/UserAuthContext';
import { useSession } from "next-auth/react";

function Join({
  clusterId,
  positioning,
  positioned,
  isUser,
  image,
  username,
  type,
  amount,
}) {
  const { data: session } = useSession();
  const { doesUserExist, setOpen } = useUserAuth();
  const dispatch = useDispatch();
  let displayName;

  if (username) {
    displayName = username.split(" ").join("").toLocaleLowerCase();
  };

  return (
    <div>
      {positioned ? (
        <div className="flex flex-col items-center">
          <div
            disabled
            className="disabled:cursor-not-allowed  
            hover:disabled:bg-gray-500"
          >
            {isUser ? (
              <Avatar
                className="uppercase border-solid border-[1px] border-red-500"
                alt={username}
                src={image}
              >
                {username && username.substring(0, 1)}
              </Avatar>
            ) : (
              <Avatar className="uppercase" alt={username} src={image}>
                {username && username.substring(0, 1)}
              </Avatar>
            )}
          </div>
          <p className="text-xs w-12 truncate text-center">{displayName}</p>
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={async () => {
            if (session) {
              const userExists = await doesUserExist(session.user.uid); 
              if (userExists === null) return null
              if (userExists) {
                dispatch(
                  set({
                    show: true,
                    id: clusterId,
                    position: positioning,
                    type: type,
                    amount: amount,
                  })
                );
              } else {
                setOpen(true)
              }
            }
          }}
        >
          <Avatar />
        </div>
      )}
    </div>
  );
};

export default Join;
