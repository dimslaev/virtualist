import { useEffect, useRef, useState } from "react";
import { Options, Return, ScrollDirection } from "./virtualist";

export const useVirtualist = <Item>({
  items,
  listHeight = 500,
  onScroll: onScrollCb,
  throttle = 50,
  renderOffset = 400,
}: Options<Item>): Return => {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(0);
  const isInitialLoad = useRef(true);
  const lastScrollTop = useRef(0);

  const [inViewIndices, setinViewIndices] = useState<number[]>([]);

  useEffect(() => {
    if (!listRef.current || !items.length) return;
    console.log("items changed");
    const list = listRef.current;
    const listRect = list.getBoundingClientRect();
    const listItems = list.childNodes;

    // Apply list styles
    list.style.overflowX = "hidden";
    list.style.overflowY = "auto";
    list.style.margin = "0px";
    list.style.padding = "0px";
    if (typeof listHeight === "number") {
      list.style.height = listHeight + "px";
    }

    const renderItems = () => {
      const newInViewIndices = [...inViewIndices];

      listItems.forEach((node, index) => {
        if (
          // @ts-ignore
          node.getBoundingClientRect().top - renderOffset <= listRect.bottom &&
          !inViewIndices.includes(index)
        ) {
          newInViewIndices.push(index);
        }
      });

      setinViewIndices(newInViewIndices);

      return newInViewIndices;
    };

    const getScrollDirection = (e: Event): ScrollDirection => {
      const target = e.currentTarget as HTMLElement;
      const direction =
        target.scrollTop > lastScrollTop.current ? "down" : "up";
      lastScrollTop.current = target.scrollTop;
      return direction;
    };

    const onScrollEnd = (originalEvent: Event, direction: ScrollDirection) => {
      const newInViewIndices =
        direction === "down" ? renderItems() : inViewIndices;

      if (typeof onScrollCb === "function") {
        onScrollCb({
          originalEvent,
          direction,
          scrollTop: list.scrollTop,
          inViewIndices: newInViewIndices,
        });
      }
    };

    const onScroll = (e: Event): void => {
      const direction = getScrollDirection(e);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = setTimeout(() => {
        onScrollEnd(e, direction);
      }, throttle);
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
    inViewIndices,
  };
};
