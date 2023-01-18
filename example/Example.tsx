import { useEffect, useState } from "react";
import { useVirtualist } from "../src/useVirtualist";
import { onScrollCallbackParams } from "../src/virtualist";
import data from "./mock_data.json";
import "./style.css";

type Record = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  description: string;
};

export const Example = () => {
  const [items, setItems] = useState<Record[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    fetchData(pageIndex).then((newItems) => {
      setItems([...items, ...(newItems as Record[])]);
      setPageIndex(pageIndex + 1);
      setLoading(false);
    });
  };

  const onScroll = (params: onScrollCallbackParams) => {
    if (params.inViewIndices.length === items.length) {
      loadMore();
    }
  };

  const { listRef, inViewIndices } = useVirtualist<Record>({
    items,
    onScroll,
  });

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <main>
      <h1>Virtualist</h1>
      <p>Loading: {String(loading)}</p>
      <ul className="list" ref={listRef}>
        {items.map((it, index) => {
          return (
            <ListItem
              key={it.id}
              inView={inViewIndices.includes(index)}
              data={it}
            />
          );
        })}
      </ul>
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
      className="item"
      style={{
        height: inView ? "auto" : "50px",
      }}
    >
      <div className="item-row" style={{ display: inView ? "flex" : "none" }}>
        <span className="item-col id">{id}</span>
        <span className="item-col first-name">{firstName}</span>
        <span className="item-col last-name">{lastName}</span>
        <span className="item-col email">{email}</span>
        <span className="item-col gender">{gender}</span>
        <span className="item-col description">{description}</span>
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
