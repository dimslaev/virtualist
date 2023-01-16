import { useEffect, useRef, useState } from "react";
import { throttle } from "./throttle";

export const useVirtualist = ({
  items,
  listHeight = 500,
  loadMore,
  onScroll: onScrollCb,
  scrollThrottle = 200, // ms
  loading,
  loadBeforeIndex = 5,
  renderOffset = 400, // px
}) => {
  const listRef = useRef(null);
  const [inView, setInView] = useState([]);

  useEffect(() => {
    if (!listRef.current || !items.length) return;

    const list = listRef.current;
    const listRect = list.getBoundingClientRect();
    const listItems = list.childNodes;

    // Apply list styles
    list.style.overflow = "auto";
    list.style.webkitOverflowScrolling = "touch";
    if (typeof listHeight === "number") {
      list.style.height = listHeight + "px";
    }

    const onScroll = throttle((e) => {
      const arr = [...inView];

      listItems.forEach((node, index) => {
        if (
          node.getBoundingClientRect().top - renderOffset <= listRect.bottom &&
          !inView.includes(index)
        ) {
          arr.push(index);
        }
      });

      setInView(arr);

      if (
        // !loading &&
        typeof loadMore === "function" &&
        arr.includes(listItems.length - loadBeforeIndex)
      ) {
        loadMore();
      }

      if (typeof onScrollCb === "function") {
        onScrollCb(e);
      }
    }, scrollThrottle);

    list.addEventListener("scroll", onScroll);
    list.dispatchEvent(new Event("scroll"));

    return () => {
      list.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return {
    listRef,
    inView,
  };
};
