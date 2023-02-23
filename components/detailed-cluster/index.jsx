import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StarIcon } from "@heroicons/react/outline";
import { Avatar } from "@material-ui/core";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../util/firebase";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ThreeBody } from "@uiball/loaders";
import Join from "./components/join";
import Joined from "./components/joined";

const calculator = (amount, deduction, percentageIncrease) => {
  const result = (amount - deduction) * ((100 + percentageIncrease) / 100);
  return result;
};

const earningsCalculator = (type) => {
  let result;
  switch (type) {
    case "Bronze":
      result = calculator(50, 2, 50);
      break;
    case "Silver":
      result = calculator(100, 5, 52);
      break;
    case "Titanium":
      result = calculator(200, 10, 54);
      break;
    case "Rhodium":
      result = calculator(500, 25, 56);
      break;
    case "Platinum":
      result = calculator(1000, 50, 58);
      break;
    case "Gold":
      result = calculator(2500, 75, 60);
      break;
    default:
      result = null;
      break;
  };
  return result;
};

function DetailedCluster({ sdata }) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [cluster, setCluster] = useState(null);
  const [copied, setCopied] = useState(false);
  let payment
  let data

  useEffect(() => {
    if (router.query.id) {
      onSnapshot(doc(db, "clusters", router.query.id), (snapshot) =>
        setCluster(snapshot.data())
      );
    };
  }, [router.query.id]);

  if (cluster) {
    data = cluster
  } else {
    data = JSON.parse(sdata)
  };

  if (data) {
    payment = earningsCalculator(data?.name);
  };

  const copy = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500);
  }
  
  return (
    <div
      className="relative flex flex-col items-center justify-center  
      ml-auto mr-auto max-w-full w-[600px] p-5"
    >
      <StarIcon className="h-10" />
      <h3 className="text-3xl">top notch of the moment</h3>
      <h3 className="text-3xl mb-3">earns</h3>
      <p className="text-3xl font-bold font-mono mb-5">Ksh.{payment}</p>
      <div className="flex justify-between w-full px-2">
        <div>
          <p className="text-[16px] font-bold">{data?.name} Cluster</p>
          <p className="text-[12px]">{data?.topNotch?.username} </p>
        </div>
        <Avatar 
          src={data?.topNotch?.usrImg} 
          className="uppercase border-solid border-[1px]"
          >
            {data?.topNotch?.username?.substring(0, 1)}
          </Avatar>
      </div>
      <div className="row-div">
        <Joined
          isUser={user?.uid === data?.topNotch?.userId}
          image={data?.topNotch?.usrImg}
          username={data?.topNotch?.username}
        />
      </div>
      <div className="row-div">
        <Joined
          isUser={user?.uid === data?.secondTierA?.userId}
          image={data?.secondTierA?.usrImg}
          username={data?.secondTierA?.username}
        />
        <Joined
          isUser={user?.uid === data?.secondTierB?.userId}
          image={data?.secondTierB?.usrImg}
          username={data?.secondTierB?.username}
        />
      </div>
      <div className="row-div">
        <Joined
          isUser={user?.uid === data?.thirdTierA?.userId}
          image={data?.thirdTierA?.usrImg}
          username={data?.thirdTierA?.username}
        />
        <Joined
          isUser={user?.uid === data?.thirdTierB?.userId}
          image={data?.thirdTierB?.usrImg}
          username={data?.thirdTierB?.username}
        />
        <Joined
          isUser={user?.uid === data?.thirdTierC?.userId}
          image={data?.thirdTierC?.usrImg}
          username={data?.thirdTierC?.username}
        />
        <Joined
          isUser={user?.uid === data?.thirdTierD?.userId}
          image={data?.thirdTierD?.usrImg}
          username={data?.thirdTierD?.username}
        />
      </div>

      <div className="row-div">
        <Join
          clusterId={router.query.id}
          positioning="inviteStageA"
          positioned={data?.inviteStageA?.joined}
          isUser={user?.uid === data?.inviteStageA?.userId}
          image={data?.inviteStageA?.usrImg}
          username={data?.inviteStageA?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageB"
          positioned={data?.inviteStageB?.joined}
          isUser={user?.uid === data?.inviteStageB?.userId}
          image={data?.inviteStageB?.usrImg}
          username={data?.inviteStageB?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageC"
          positioned={data?.inviteStageC?.joined}
          isUser={user?.uid === data?.inviteStageC?.userId}
          image={data?.inviteStageC?.usrImg}
          username={data?.inviteStageC?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageD"
          positioned={data?.inviteStageD?.joined}
          isUser={user?.uid === data?.inviteStageD?.userId}
          image={data?.inviteStageD?.usrImg}
          username={data?.inviteStageD?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageE"
          positioned={data?.inviteStageE?.joined}
          isUser={user?.uid === data?.inviteStageE?.userId}
          image={data?.inviteStageE?.usrImg}
          username={data?.inviteStageE?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageF"
          positioned={data?.inviteStageF?.joined}
          isUser={user?.uid === data?.inviteStageF?.userId}
          image={data?.inviteStageF?.usrImg}
          username={data?.inviteStageF?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageG"
          positioned={data?.inviteStageG?.joined}
          isUser={user?.uid === data?.inviteStageG?.userId}
          image={data?.inviteStageG?.usrImg}
          username={data?.inviteStageG?.username}
          type={data?.name}
          amount={payment}
        />
        <Join
          clusterId={router.query.id}
          positioning="inviteStageH"
          positioned={data?.inviteStageH?.joined}
          isUser={user?.uid === data?.inviteStageH?.userId}
          image={data?.inviteStageH?.usrImg}
          username={data?.inviteStageH?.username}
          type={data?.name}
          amount={payment}
        />
      </div>
      <div className="mt-8 py-2">
        <CopyToClipboard 
          text={router.query.id}
          onCopy={copy}
        >
          <button 
            className="bg-teal-900 rounded-full text-white font-bold text-sm py-2 px-12 uppercase"
          >
            copy cluster code
          </button>
        </CopyToClipboard>
      </div>
      {copied && <div className="absolute bg-teal-900 rounded-full text-white font-semibold text-sm py-2 px-6
      top-4 right-8">
        cluster code copied
      </div>}
    </div>
  );
};

export default DetailedCluster;
