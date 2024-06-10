import { useState, useEffect, useCallback } from "react";

function useThrottle(func, delay) {
  const [timer, setTimer] = useState(0);
  const throttledFunction = useCallback(() => {
    if (timer === 0) {
      func();
      return setTimer(delay);
    }
    alert(`Try again in ${Math.ceil(timer / 1000)} seconds`);
  }, [func, timer, delay]);

  useEffect(() => {
    if (timer !== 0) {
      const intervalId = setInterval(() => {
        return setTimer((prevTimer: number) =>
          prevTimer > 1000 ? prevTimer - 1000 : 0
        );
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [timer]);

  return throttledFunction;
}

export default useThrottle;
