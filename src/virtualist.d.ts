export type ScrollDirection = "up" | "down";

export type onScrollCallbackParams = {
  direction: ScrollDirection;
  scrollTop: number;
  inViewIndices: number[];
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
  inViewIndices: number[];
}