import CardSkeleton from "./CardSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <CardSkeleton />

    </div>
  );
};

export default DashboardSkeleton;