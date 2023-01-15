import { useEffect, useRef, useState } from "react";
import { throttle } from "../throttle";
import { useIsInitialRender } from "./useIsInitialRender";

export const useVirtualist = ({
  items,
  loadMore,
  onScroll,
  loading,
  loadMoreWhenCount = 5,
  trottleDelay = 400,
}) => {
  const listRef = useRef(null);
  const [inView, setInView] = useState([]);

  isInitialRender = useIsInitialRender();

  useEffect(() => {
    if (isInitialRender && typeof loadMore === "function") {
      loadMore();
    }

    if (!listRef.current || !items.length || loading) return;

    const listRect = listRef.current.getBoundingClientRect();

    const onScrollList = throttle((e) => {
      const arr = [...inView];

      listRef.current.childNodes.forEach((childNode, childNodeIndex) => {
        const rect = childNode.getBoundingClientRect();

        if (
          rect.top - listRect.bottom <= listRect.bottom &&
          !inView.includes(childNodeIndex)
        ) {
          arr.push(childNodeIndex);
        }
      });

      setInView(arr);

      if (
        typeof loadMore === "function" &&
        arr.includes(listRef.current.childNodes.length - loadMoreWhenCount)
      ) {
        loadMore();
      }

      if (typeof onScroll === "function" && e) {
        onScroll(e);
      }
    }, trottleDelay);

    listRef.current.addEventListener("scroll", onScrollList);
    listRef.current.dispatchEvent(new Event("scroll"));

    return () => {
      listRef.current.removeEventListener("scroll", onScrollList);
    };
  }, [items]);

  return {
    listRef,
    inView,
  };
};
