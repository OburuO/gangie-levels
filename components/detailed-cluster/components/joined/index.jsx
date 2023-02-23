import { Avatar } from "@material-ui/core";

function Joined({ isUser, image, username }) {
  const displayName = username?.split(" ").join("").toLocaleLowerCase();

  return (
    <div className="flex flex-col items-center">
      <div>
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
  );
};

export default Joined;
