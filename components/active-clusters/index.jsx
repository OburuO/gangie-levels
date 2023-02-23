import { useUserAuth } from '../../context/UserAuthContext';
import InfoNav from '../info-nav';
import ActiveClusterRow from './ActiveClusterRow';
import Skeleton from './skeleton';

function ActiveClusters() {
  const { clusters } = useUserAuth();
  const skeleton = clusters === null;

  return (
    <div className="ml-10">
      <p className="text-lg p-2 font-bold text-gray-800">Your Active Clusters</p>
      <div className='h-[474px]'>
        {skeleton ? (
          <Skeleton />
        ) : (
          clusters?.map((cluster, i) => (
            <ActiveClusterRow 
              key={cluster.id}
              id={cluster.id}
              type={cluster.data().name}
              index={i}
            />
          ))
        )}
      </div>
      <div>
        <InfoNav />
      </div>
    </div>
  ); 
};

export default ActiveClusters;
