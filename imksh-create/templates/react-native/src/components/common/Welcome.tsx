import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import LottieView from "lottie-react-native";
import infinity1 from "../../../assets/animations/infinity.json";
import { Txt } from "./Typography";
import { useAuthStore } from "@/store/useAuthStore";

const emojis = [
  "😎", "😍", "🤩", "🎉", "🥳", "💐", "✨", "😊", "👋", "💖", "🤗"
];

const Welcome = () => {
  const { user } = useAuthStore();
  const [i, setI] = useState(0);
  const [emoji, setEmoji] = useState("😎");

  useEffect(() => {
    const timer = setInterval(() => {
      setI((prevI) => {
        const nextI = (prevI + 1) % emojis.length;
        setEmoji(emojis[nextI]);
        return nextI;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  return (
    <View className="flex-row flex-wrap justify-between item-center pl-4 mt-6 items-center">
      <View className="w-[55%] relative justify-end">
        <Txt variant="h1"> Hey {user ? user.name : "There"}!</Txt>
        <View className="flex-row w-64 items-center">
          <Txt variant="h1">Welcome Back</Txt>
          <Text
            key={i}
            style={{ fontSize: 28 }}
            className="animate-float-up relative top-3"
          >
            {" "}
            {emoji}
          </Text>
        </View>
      </View>
      <View className="w-[45%] justify-center items-center ">
        <LottieView
          source={infinity1}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
      </View>
    </View>
  );
};

export default Welcome;
