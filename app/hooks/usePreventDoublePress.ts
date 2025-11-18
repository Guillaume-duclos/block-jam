import { useRef } from "react";

export const usePreventDoublePress = (delay: number = 500) => {
  const lastPress = useRef(0);

  return () => {
    const now = Date.now();

    if (now - lastPress.current > delay) {
      lastPress.current = now;
      return true;
    }

    return false;
  };
};
