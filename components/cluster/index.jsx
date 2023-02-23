import { GiftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

export const clusterColorDeterminant = (type) => {
  let result;
  switch (type) {
    case "Bronze":
      result = "#CD7F32";
      break;
    case "Silver":
      result = "#C0C0C0";
      break;
    case "Titanium":
      result = "#878681";
      break;
    case "Rhodium":
      result = "#D1D7D7";
      break;
    case "Platinum":
      result = "#E5E4E2";
      break;
    case "Gold":
      result = "#FFD700";
      break;
    default:
      result = null;
      break;
  }
  return result;
};

function Cluster({ name, amount, id }) {
  const color = clusterColorDeterminant(name);
  const router = useRouter();

  return (
    <div
      className={`relative max-w-full border-solid border-[1px] 
      border-gray-300 shadow-md rounded-t-md rounded-b-md`}
      style={{backgroundColor: color}}
    >
      <div className="flex flex-col items-center p-3">
        <div>
          <GiftIcon className="h-8 text-[#37003c]" />
        </div>
        <p className="text-[12px]">
          {name + " "}
          <span className="text-[13px] font-extrabold">Ksh.{amount}</span>
        </p>
        <button
          className="w-full hover:bg-[#37003c] hover:text-white 
          bg-[#fff] rounded-full px-3 mt-3 font-semibold text-sm py-1"
          onClick={() => {
            router.push(`/cluster/${id}`);
          }}
        >
          Join This Cluster
        </button>
      </div>
    </div>
  );
};

export default Cluster;
