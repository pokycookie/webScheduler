import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import TodoList from "./components/todoList";
import IndexedDB from "./indexedDB";

interface IProps {
  power: boolean;
  setPower: Dispatch<SetStateAction<boolean>>;
  DB?: IDBDatabase;
}

export default function Scheduler(props: IProps) {
  const [inputStr, setInputStr] = useState<string>("");
  const [dataArr, setDataArr] = useState<any[]>([]);

  const refreshData = async () => {
    if (props.DB) {
      const IDB = await IndexedDB.readAll(props.DB, "todo");
      setDataArr(IDB);
    }
  };

  const powerBtnHandler = () => {
    props.setPower((prev) => (prev ? false : true));
  };

  const submit = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey === true) {
        refreshData();
      } else {
        if (props.DB) {
          const data = {
            updated: new Date(),
            content: inputStr,
          };
          IndexedDB.create(props.DB, "todo", data);
        }
        refreshData();
        setInputStr("");
      }
    }
  };

  // Initailize
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.DB]);

  return (
    <div
      className="scheduler"
      style={{
        transform: props.power ? `translateX(0px)` : "translateX(330px)",
      }}
    >
      <button className="powerBtn" onClick={powerBtnHandler}></button>
      <div className="main">
        <header>
          <FontAwesomeIcon className="menu" icon={faBars} />
        </header>
        <input
          onKeyUp={submit}
          placeholder="💡 Please enter your idea!"
          value={inputStr}
          onChange={({ target }) => setInputStr(target.value)}
        />
        <div className="todoListArea">
          {dataArr.map((element, index) => {
            return (
              <TodoList
                data={element}
                key={index}
                DB={props.DB}
                refreshData={refreshData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
