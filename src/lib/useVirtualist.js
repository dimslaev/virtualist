import { useEffect, useRef, useState } from "react";

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
  const scrollTimer = useRef(null);
  const isInitialLoad = useRef(true);
  const lastScrollTop = useRef(0);

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

    const onScrollEnd = (direction) => {
      if (direction == "down") {
        const arr = revealItems();

        if (
          typeof loadMore === "function" &&
          arr.includes(listItems.length - loadBeforeIndex)
        ) {
          loadMore();
        }
      }

      if (typeof onScrollCb === "function") {
        onScrollCb({ direction, scrollTop: list.scrollTop });
      }
    };

    const onScroll = (e) => {
      const direction =
        e.target.scrollTop > lastScrollTop.current ? "down" : "up";
      lastScrollTop.current = e.target.scrollTop;

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = setTimeout(() => {
        onScrollEnd(direction);
      }, scrollThrottle);
    };

    if (isInitialLoad.current) {
      revealItems();
      isInitialLoad.current = false;
    }

    list.addEventListener("scroll", onScroll);

    return () => {
      list.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return {
    listRef,
    inView,
  };
};
