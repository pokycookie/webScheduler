import { useEffect, useRef } from "react";

type ICallback = () => void;

export function useInterval(callback: ICallback, delay: number | null) {
  const currentFn = useRef<ICallback>(callback);

  useEffect(() => {
    currentFn.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => currentFn.current();
    if (delay !== null) {
      const interval = setInterval(handler, delay);
      return () => clearInterval(interval);
    }
  });
}
