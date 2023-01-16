import { useEffect, useRef, useState } from "react";
import { Options, Return, ScrollDirection } from "./virtualist";

export const useVirtualist = <Item>({
  items,
  listHeight = 500,
  loadMore,
  onScroll: onScrollCb,
  scrollThrottle = 50,
  loadBeforeIndex = 15,
  renderOffset = 400,
}: Options<Item>): Return => {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(0);
  const isInitialLoad = useRef(true);
  const lastScrollTop = useRef(0);

  const [inViewItemIndices, setInViewItemIndices] = useState<number[]>([]);

  useEffect(() => {
    if (!listRef.current || !items.length) return;

    const list = listRef.current;
    const listRect = list.getBoundingClientRect();
    const listItems = list.childNodes;

    // Apply list styles
    list.style.overflow = "auto";
    list.style.margin = "0px";
    list.style.padding = "0px";
    if (typeof listHeight === "number") {
      list.style.height = listHeight + "px";
    }

    const renderItems = () => {
      const arr = [...inViewItemIndices];

      listItems.forEach((node, index) => {
        if (
          // @ts-ignore
          node.getBoundingClientRect().top - renderOffset <= listRect.bottom &&
          !inViewItemIndices.includes(index)
        ) {
          arr.push(index);
        }
      });

      setInViewItemIndices(arr);

      return arr;
    };

    const getScrollDirection = (e: Event): ScrollDirection => {
      const target = e.currentTarget as HTMLElement;
      const direction =
        target.scrollTop > lastScrollTop.current ? "down" : "up";
      lastScrollTop.current = target.scrollTop;
      return direction;
    };

    const onScrollEnd = (direction: ScrollDirection) => {
      if (direction === "down") {
        const arr = renderItems();

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

    const onScroll = (e: Event): void => {
      const direction = getScrollDirection(e);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = setTimeout(() => {
        onScrollEnd(direction);
      }, scrollThrottle);
    };

    if (isInitialLoad.current) {
      renderItems();
      isInitialLoad.current = false;
    }

    list.addEventListener("scroll", onScroll);

    return () => {
      list.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return {
    listRef,
    inViewItemIndices,
  };
};
