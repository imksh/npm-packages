const Skeleton = ({
  className = "",
  rounded = "rounded-lg",
  animate = true,
}) => {
  return (
    <div
      className={`
        bg-base-300
        ${rounded}
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}
    />
  );
};

export default Skeleton;