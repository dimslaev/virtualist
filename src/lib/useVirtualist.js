import { useEffect, useRef, useState } from "react";
import { throttle } from "./throttle";

export const useVirtualist = ({
  items,
  listHeight = 500,
  loadMore,
  onScroll: onScrollCb,
  scrollThrottle = 50, // ms
  loadBeforeIndex = 15,
  renderOffset = 400, // px
}) => {
  const listRef = useRef(null);
  const [inView, setInView] = useState([]);

  const timer = useRef(null);
  const initialLoad = useRef(true);

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

    const revealItems = () => {
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

      return arr;
    };

    const onScroll = (e) => {
      const arr = revealItems();

      if (
        typeof loadMore === "function" &&
        arr.includes(listItems.length - loadBeforeIndex)
      ) {
        loadMore();
      }

      if (typeof onScrollCb === "function") {
        onScrollCb(e);
      }
    };

    const onScrollEnd = (e) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        onScroll(e);
      }, scrollThrottle);
    };

    if (initialLoad.current) {
      revealItems();
      initialLoad.current = false;
    }

    list.addEventListener("scroll", onScrollEnd);

    return () => {
      list.removeEventListener("scroll", onScrollEnd);
    };
  }, [items]);

  return {
    listRef,
    inView,
  };
};
