import React, { useRef, forwardRef, useState } from "react";
import data from "../MOCK_DATA.json";
import "./style.scss";

export const Example = () => {
  return (
    <main>
      <div className="list-wrapper">
        <List items={data} visibleCount={20} />
      </div>
    </main>
  );
};

const getChunkTotalHeight = (heights) => {
  let result = 0;
  heights.forEach((height) => {
    result += height;
  });
  return result;
};

export const List = forwardRef(({ items, visibleCount }, ref) => {
  const listRef = useRef(null);
  const spacerTopRef = useRef(null);
  const spacerBottomRef = useRef(null);
  const visibleItemsHeightsRef = useRef([]);

  const lastScrollPosition = useRef(0);

  const [chunkIndex, setChunkIndex] = useState(1);

  const [visibleItems, setVisibleItems] = useState(
    items.filter((_, index) => index < visibleCount)
  );

  console.log("visibleItemsHeightsRef", visibleItemsHeightsRef.current);

  const onScroll = (e) => {
    const list = e.target;
    const chunkHeight = getChunkTotalHeight(
      visibleItemsHeightsRef.current.filter(
        (_, i) => i < chunkIndex * visibleCount
      )
    );

    console.log("chunkHeight", chunkHeight);

    // scrolling down
    if (list.scrollTop > lastScrollPosition.current) {
      console.log("scrolling down");
      console.log(
        "list.scrollTop + list.offsetHeight",
        list.scrollTop + list.offsetHeight
      );

      if (
        list.scrollTop + list.offsetHeight >= chunkHeight &&
        spacerTopRef.current.offsetHeight !== chunkHeight
      ) {
        console.log(
          "spacerTopRef.offsetHeight",
          spacerTopRef.current.offsetHeight
        );

        const newChunkIndex = chunkIndex + 1;

        spacerTopRef.current.style.height = chunkHeight + "px";

        setVisibleItems(
          items.filter(
            (_, index) =>
              index > chunkIndex * visibleCount &&
              index < newChunkIndex * visibleCount
          )
        );

        setChunkIndex(newChunkIndex);

        list.scrollTop = chunkHeight;
      }
    } // scrolling up
    else {
      console.log("scrolling up", list.scrollTop);
    }
    lastScrollPosition.current = list.scrollTop;
  };

  return (
    <ul className="list" ref={listRef} onScroll={onScroll}>
      <li ref={spacerTopRef}></li>
      {visibleItems.map((item, i) => {
        return (
          <ListItem
            {...item}
            key={`item-${i}`}
            ref={(node) => {
              if (node) {
                visibleItemsHeightsRef.current.push(node.offsetHeight);
              }
            }}
          />
        );
      })}
      <li ref={spacerBottomRef}></li>
    </ul>
  );
});

export const ListItem = forwardRef(
  (
    {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      description,
    },
    ref
  ) => {
    return (
      <li className="list__item" ref={ref}>
        <span className="list__item__column list__item__column--id">{id}</span>
        <span className="list__item__column list__item__column--first-name">
          {firstName}
        </span>
        <span className="list__item__column list__item__column--last-name">
          {lastName}
        </span>
        <span className="list__item__column list__item__column--email">
          {email}
        </span>
        <span className="list__item__column list__item__column--gender">
          {gender}
        </span>
        <span className="list__item__column list__item__column--description">
          {description}
        </span>
      </li>
    );
  }
);

export default Example;
