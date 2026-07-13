import Skeleton from "./Skeleton";

const PageSkeleton = () => {
  return (
    <div className="space-y-8">

      <Skeleton className="h-10 w-56" />

      <Skeleton className="h-64 w-full rounded-2xl" />

      <div className="grid md:grid-cols-3 gap-6">

        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-40 rounded-xl"
          />
        ))}

      </div>

    </div>
  );
};

export default PageSkeleton;