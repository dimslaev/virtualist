import React from "react";
import { useVirtualist, onScrollCallbackParams } from "@dims/virtualist";
import data from "./mock_data.json";
import "./style.css";

type Record = {
  id: string;
  first_name: string;
  description: string;
};

export const Example = () => {
  const [items, setItems] = React.useState<Record[]>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const loadMore = () => {
    setLoading(true);
    fetchData(pageIndex).then((newItems) => {
      setItems([...items, ...(newItems as Record[])]);
      setPageIndex(pageIndex + 1);
      setLoading(false);
    });
  };

  const onScroll = (params: onScrollCallbackParams) => {
    if (params.renderedIndices.length === items.length) {
      loadMore();
    }
  };

  const { listRef, renderedIndices } = useVirtualist<Record>({
    items,
    onScroll,
  });

  React.useEffect(() => {
    loadMore();
  }, []);

  return (
    <main>
      <h1>Virtualist</h1>
      <p>Loading: {String(loading)}</p>
      <ul className="list" ref={listRef}>
        {items.map((it, index) =>
          renderedIndices.includes(index) ? (
            <ListItem {...it} key={it.id} />
          ) : (
            <ListItemPlaceholder key={it.id} />
          ),
        )}
      </ul>
    </main>
  );
};

export const ListItemPlaceholder = () => (
  <li
    className="item"
    style={{
      height: 50,
    }}
  ></li>
);

export const ListItem = ({
  id,
  first_name: firstName,
  description,
}: Record) => {
  return (
    <li className="item">
      <span className="item-col id">{id}</span>
      <span className="item-col first-name">{firstName}</span>
      <span className="item-col desc">{description}</span>
    </li>
  );
};

// Fake fetch method
export const fetchData = (pageIndex: number, pageSize = 20) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
      );
    }, 500);
  });

export default Example;
