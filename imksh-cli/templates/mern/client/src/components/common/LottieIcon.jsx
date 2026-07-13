import { memo, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import lottie from "lottie-web";

const LottieIcon = memo(
  ({ animation, className = "", loop = true, autoplay = true }) => {
    const containerRef = useRef(null);

    const isInView = useInView(containerRef, {
      once: true,
      margin: "100px",
    });

    useEffect(() => {
      if (!isInView || !containerRef.current) return;

      const instance = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        animationData: animation,
      });

      return () => {
        instance.destroy();
      };
    }, [animation, autoplay, loop, isInView]);

    return <div ref={containerRef} className={className} />;
  },
);

LottieIcon.displayName = "LottieIcon";

export default LottieIcon;
