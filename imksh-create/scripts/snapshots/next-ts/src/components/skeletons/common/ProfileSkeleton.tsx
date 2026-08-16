import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex gap-6 items-center">

      <Skeleton className="w-24 h-24 rounded-full" />

      <div className="flex-1 space-y-3">

        <Skeleton className="h-6 w-48" />

        <Skeleton className="h-4 w-64" />

        <Skeleton className="h-10 w-32" />

      </div>

    </div>
  );
};

export default ProfileSkeleton;