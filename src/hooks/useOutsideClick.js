import { useRef, useEffect, useCallback } from "react";

const useOutsideClick = (callback) => {
  const ref = useRef();

  const clickEvent = useCallback(
    (ev) => {
      if (ref.current && !ref.current.contains(ev.target)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener("click", clickEvent);
    return () => {
      document.removeEventListener("click", clickEvent);
    };
  }, [clickEvent]);

  return ref;
};

export { useOutsideClick };
