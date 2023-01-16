import React, { useEffect, useState } from "react";
import { useVirtualist } from "../lib/useVirtualist";
import data from "./mock_data.json";
import "./style.scss";

export const Example = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    fetchData(pageIndex).then((newItems) => {
      setItems([...items, ...newItems]);
      setPageIndex(pageIndex + 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMore();
  }, []);

  const onScroll = (e) => {
    console.log("scroll", e);
  };

  const { listRef, inView } = useVirtualist({
    items,
    loadMore,
    loading,
    setLoading,
    onScroll,
  });

  return (
    <main>
      <div className="list-wrapper">
        <div>Loading: {String(loading)}</div>
        <ul className="list" ref={listRef}>
          {items.map((it, index) => {
            return (
              <ListItem key={it.id} inView={inView.includes(index)} data={it} />
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export const ListItem = (props) => {
  const {
    data: {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      gender,
      description,
    },
    inView,
  } = props;

  return (
    <li
      className="list__item"
      style={{
        height: inView ? "auto" : "50px",
      }}
    >
      <div
        className="list__item__content"
        style={{ display: inView ? "flex" : "none" }}
      >
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
      </div>
    </li>
  );
};

// Fake fetch method
export const fetchData = (pageIndex, pageSize = 20) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      );
    }, 500);
  });

export default Example;
