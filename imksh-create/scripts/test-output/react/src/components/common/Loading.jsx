import React from "react";
import LottieAnimation from "./LottieIcon";
import loader from "../../assets/animations/loading.json";

const Loading = ({
  className = "w-60 h-60",
  bgClass = "bg-base-100",
  animationData = loader,
}) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-50 ${bgClass} max-h-dvh`}
    >
      <LottieAnimation animation={animationData} className={className} />
    </div>
  );
};

export default Loading;
