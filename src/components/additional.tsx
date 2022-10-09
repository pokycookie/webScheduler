import { faRotateLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IndexedDB from "../indexedDB";
import { IReduxStore } from "../redux";
import "../styles/additional.scss";
import { IColor, IData } from "../type";
import HslSelector from "./hslSelector";

interface ISetting {
  setHue: React.Dispatch<React.SetStateAction<number>>;
}

interface IProps {
  DB?: IDBDatabase;
  refresh: () => Promise<void>;
}

type TMenu = "completed" | "setting";

export default function Additional(props: IProps) {
  const [power, setPower] = useState<boolean>(false);
  const [completedArr, setCompletedArr] = useState<IData[]>([]);
  const [menu, setMenu] = useState<TMenu>("completed");

  const colorObj = useSelector<IReduxStore, IColor>((state) => {
    return state.color;
  }, shallowEqual);

  const powerBtnHandler = () => {
    setPower((prev) => (prev ? false : true));
  };

  const deleteData = async (key: any) => {
    if (props.DB) {
      await IndexedDB.delete(props.DB, "completed", key);
      const tempArr = await IndexedDB.readAll<IData>(props.DB, "completed");
      setCompletedArr(tempArr);
      await props.refresh();
    }
  };

  const restoreData = async (data: IData) => {
    if (props.DB && data._id) {
      const tempData = { ...data };
      tempData.checked = false;
      await IndexedDB.update(props.DB, "completed", data._id, tempData);
      await IndexedDB.move(props.DB, "completed", "todo", data._id);
      const tempArr = await IndexedDB.readAll<IData>(props.DB, "completed");
      setCompletedArr(tempArr);
      await props.refresh();
    }
  };

  useEffect(() => {
    const getDB = async (DB: IDBDatabase) => {
      const result = await IndexedDB.readAll<IData>(DB, "completed");
      console.log(result);
      setCompletedArr(result);
    };
    if (props.DB) getDB(props.DB);
  }, [props.DB, power]);

  return (
    <div className={`additionalArea${power ? " on" : ""}`}>
      <button
        className="powerBtn"
        onClick={powerBtnHandler}
        style={{ backgroundColor: colorObj.darker }}
      ></button>
      <div className="mainArea" style={{ backgroundColor: colorObj.darker }}>
        <div className="menuArea" style={{ backgroundColor: colorObj.light }}>
          <button
            style={
              menu === "completed"
                ? { backgroundColor: colorObj.darkest, color: "white" }
                : undefined
            }
            onClick={() => {
              setMenu("completed");
            }}
          >
            Completed
          </button>
          <button
            style={
              menu === "setting" ? { backgroundColor: colorObj.darkest, color: "white" } : undefined
            }
            onClick={() => {
              setMenu("setting");
            }}
          >
            Setting
          </button>
        </div>
        <div className="contentArea" style={{ backgroundColor: colorObj.lighter }}>
          {menu === "completed" ? (
            <div className="completedListArea">
              {completedArr.map((element) => {
                return (
                  <li className="completedList" key={element._id}>
                    <p>{element.content}</p>
                    <div className="iconArea">
                      <FontAwesomeIcon
                        className="icon rotate"
                        icon={faRotateLeft}
                        onClick={() => {
                          restoreData(element);
                        }}
                      />
                      <FontAwesomeIcon
                        className="icon trash"
                        icon={faTrashCan}
                        onClick={() => {
                          deleteData(element._id);
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </div>
          ) : null}
          {menu === "setting" ? (
            <div className="settingArea">
              <div className="color">
                <p>Color Theme</p>
                {/* <HslSelector onChange={(hue) => props.setting.setHue(hue)} /> */}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
