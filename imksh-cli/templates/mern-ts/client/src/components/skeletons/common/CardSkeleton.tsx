import Skeleton from "./Skeleton";

const CardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body space-y-4">

        <Skeleton className="h-40 w-full rounded-xl" />

        <Skeleton className="h-6 w-2/3" />

        <Skeleton className="h-4 w-full" />

        <Skeleton className="h-4 w-5/6" />

        <Skeleton className="h-10 w-28" />

      </div>
    </div>
  );
};

export default CardSkeleton;