import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import IndexedDB from "../indexedDB";
import Checkbox from "./checkbox";

interface IProps {
  data: any;
  DB?: IDBDatabase;
  refreshData: () => void;
}

export default function TodoList(props: IProps) {
  const [enter, setEnter] = useState<boolean>(false);

  const deleteData = (key: any) => {
    if (props.DB) {
      IndexedDB.delete(props.DB, "todo", key);
    }
  };

  const deleteHandler = () => {
    deleteData(props.data._id);
    props.refreshData();
  };

  return (
    <div
      className="todoList"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <Checkbox />
      <p className="content">{props.data.content}</p>
      <FontAwesomeIcon
        className="icon"
        icon={faPencil}
        style={{ opacity: enter ? 1 : 0 }}
      />
      <FontAwesomeIcon
        className="icon"
        icon={faTrashCan}
        style={{ opacity: enter ? 1 : 0 }}
        onClick={deleteHandler}
      />
    </div>
  );
}
