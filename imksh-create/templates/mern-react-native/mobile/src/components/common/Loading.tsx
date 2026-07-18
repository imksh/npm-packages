import { View } from "react-native";
import LottieView from "lottie-react-native";
import animation from "../../../assets/animations/loading.json";

const Loading = ({
  className = "w-60 h-60",
  bgClass = "bg-base-100",
  animationData = animation,
}) => {
  return (
    <View
      className={`absolute top-0 bottom-0 left-0 right-0 items-center justify-center z-50 ${bgClass}`}
    >
      <View className={className}>
        <LottieView
          source={animationData}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </View>
  );
};

export default Loading;
