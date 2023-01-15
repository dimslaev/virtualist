import { useEffect, useRef } from "react";

export const useIsInitialRender = () => {
  const ref = useRef();
  useEffect(() => {
    ref.current = true;
  }, []);
  return !ref.current;
};
