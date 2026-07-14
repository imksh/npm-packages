import Skeleton from "./Skeleton";

const ListSkeleton = ({ items = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4"
        >
          <Skeleton className="w-12 h-12 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />

            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;