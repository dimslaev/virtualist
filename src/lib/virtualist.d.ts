export type ScrollDirection = "up" | "down";

export type onScrollCallbackParams = {
  direction: ScrollDirection;
  scrollTop: number;
};

export interface Options<T> {
  items: T[];
  listHeight?: number;
  loadMore?: () => void;
  onScroll?: (params: onScrollCallbackParams) => void;
  scrollThrottle?: number;
  loadBeforeIndex?: number;
  renderOffset?: number;
}

export interface Return {
  listRef: React.RefObject<HTMLUListElement>;
  inViewItemIndices: number[];
}
