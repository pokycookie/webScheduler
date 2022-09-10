import { useEffect, useState } from "react";
import IndexedDB from "../indexedDB";
import "../styles/additional.scss";
import { IData } from "../type";

interface IProps {
  DB?: IDBDatabase;
}

export default function Additional(props: IProps) {
  const [power, setPower] = useState<boolean>(false);
  const [completedArr, setCompletedArr] = useState<IData[]>([]);

  const powerBtnHandler = () => {
    setPower((prev) => (prev ? false : true));
  };

  useEffect(() => {
    const getDB = async (DB: IDBDatabase) => {
      const result = await IndexedDB.readAll(DB, "completed");
      console.log(result);
      setCompletedArr(result);
    };
    if (props.DB) getDB(props.DB);
  }, [props.DB]);

  return (
    <div className={`additionalArea${power ? " on" : ""}`}>
      <button className="powerBtn" onClick={powerBtnHandler}></button>
      <div className="contentArea">
        <div className="completedListArea">
          {completedArr.map((element) => {
            return (
              <li className="completedList" key={element._id}>
                <p>{element.content}</p>
              </li>
            );
          })}
        </div>
      </div>
    </div>
  );
}
