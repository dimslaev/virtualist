import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down";

export type onScrollCallbackParams = {
  direction: ScrollDirection;
  scrollTop: number;
  renderedIndices: number[];
  originalEvent: Event;
};

export interface Options<T> {
  items: T[];
  listHeight?: number;
  onScroll?: (params: onScrollCallbackParams) => void;
  throttle?: number;
  renderOffset?: number;
}

export interface Return {
  listRef: React.RefObject<HTMLUListElement>;
  renderedIndices: number[];
}

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

  const [renderedIndices, setRenderedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (!listRef.current || !items.length) return;
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
      const newRenderedIndices = [...renderedIndices];

      listItems.forEach((item, index) => {
        const node = item as HTMLElement;
        if (
          node.getBoundingClientRect().top - renderOffset <= listRect.bottom &&
          !renderedIndices.includes(index)
        ) {
          newRenderedIndices.push(index);
        }
      });

      setRenderedIndices(newRenderedIndices);

      return newRenderedIndices;
    };

    const getScrollDirection = (e: Event): ScrollDirection => {
      const target = e.currentTarget as HTMLElement;
      const direction =
        target.scrollTop > lastScrollTop.current ? "down" : "up";
      lastScrollTop.current = target.scrollTop;
      return direction;
    };

    const onScrollEnd = (originalEvent: Event, direction: ScrollDirection) => {
      const newRenderedIndices =
        direction === "down" ? renderItems() : renderedIndices;

      if (typeof onScrollCb === "function") {
        onScrollCb({
          originalEvent,
          direction,
          scrollTop: list.scrollTop,
          renderedIndices: newRenderedIndices,
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
    renderedIndices,
  };
};

export default useVirtualist;
