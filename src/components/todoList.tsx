import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import IndexedDB from "../indexedDB";
import { IData } from "../type";
import Checkbox from "./checkbox";

interface IProps {
  data: IData;
  DB?: IDBDatabase;
  refreshData: () => void;
}

export default function TodoList(props: IProps) {
  const [enter, setEnter] = useState<boolean>(false);
  const [inputStr, setInputStr] = useState<string>(props.data.content);
  const [checked, setChecked] = useState<boolean>(props.data.checked);

  const deleteData = async (key: any) => {
    if (props.DB && props.data._id) {
      await IndexedDB.delete(props.DB, "todo", props.data._id);
      props.refreshData();
    }
  };

  const updateData = async () => {
    if (props.DB && props.data._id) {
      const data: IData = {
        updated: new Date(),
        content: inputStr,
        checked,
      };
      await IndexedDB.update(props.DB, "todo", props.data._id, data);
      props.refreshData();
    }
  };

  const checkboxHandler = async () => {
    const tempCheck = checked ? false : true;
    if (props.DB && props.data._id) {
      await IndexedDB.update(props.DB, "todo", props.data._id, {
        checked: tempCheck,
      });
      props.refreshData();
    }
  };

  const submit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (document.activeElement as HTMLElement).blur();
    }
  };
  const focusOut = () => {
    if (props.data.content !== inputStr) updateData();
  };

  // Update data when refreshed
  useEffect(() => {
    setInputStr(props.data.content);
    setChecked(props.data.checked);
  }, [props.data]);

  return (
    <div
      className="todoList"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <Checkbox checked={checked} onClick={checkboxHandler} />
      {checked ? (
        <input
          className="todoListInput"
          value={inputStr}
          readOnly
          style={{ textDecoration: "line-through", color: "#a66cff" }}
        />
      ) : (
        <input
          className="todoListInput"
          value={inputStr}
          onKeyUp={submit}
          onBlur={focusOut}
          onChange={({ target }) => setInputStr(target.value)}
          style={{
            textDecoration: "none",
            color: "#343a40",
          }}
        />
      )}

      <FontAwesomeIcon
        className="icon delete"
        icon={faTrashCan}
        style={{ opacity: enter ? 1 : 0 }}
        onClick={deleteData}
      />
    </div>
  );
}
