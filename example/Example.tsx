import { useEffect, useState } from "react";
import { useVirtualist } from "../src/useVirtualist";
import { onScrollCallbackParams } from "../src/virtualist";
import data from "./mock_data.json";
import "./style.scss";

type Record = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  description: string;
};

export const Example = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [items, setItems] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    fetchData(pageIndex).then((newItems) => {
      setItems([...items, ...(newItems as Record[])]);
      setPageIndex(pageIndex + 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMore();
  }, []);

  const onScroll = (params: onScrollCallbackParams) => {
    console.log("scroll", params);
  };

  const { listRef, inViewItemIndices } = useVirtualist<Record>({
    items,
    loadMore,
    onScroll,
  });

  return (
    <main>
      <div className="list-wrapper">
        <div>Loading: {String(loading)}</div>
        <ul className="list" ref={listRef}>
          {items.map((it, index) => {
            return (
              <ListItem
                key={it.id}
                inView={inViewItemIndices.includes(index)}
                data={it}
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export const ListItem = ({
  data: {
    id,
    first_name: firstName,
    last_name: lastName,
    email,
    gender,
    description,
  },
  inView,
}: {
  data: Record;
  inView: boolean;
}) => {
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
export const fetchData = (pageIndex: number, pageSize = 20) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      );
    }, 500);
  });

export default Example;
