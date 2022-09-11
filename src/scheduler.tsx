import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import TodoList from "./components/todoList";
import UndoBtn from "./components/undoBtn";
import IndexedDB from "./indexedDB";
import { IData } from "./type";

interface IProps {
  DB?: IDBDatabase;
}

interface ISortedData {
  end: string;
  data: IData[];
}

export default function Scheduler(props: IProps) {
  const [inputStr, setInputStr] = useState<string>("");
  const [dataArr, setDataArr] = useState<ISortedData[]>([]);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<boolean>(false);
  const [optionDate, setOptionDate] = useState(new Date());
  const [undo, setUndo] = useState<IData>();

  const inputRef = useRef<HTMLInputElement>(null);

  const completedData = async () => {
    if (props.DB) {
      const IDB = await IndexedDB.readAll<IData>(props.DB, "todo");
      const current = new Date(moment(new Date()).subtract(1, "d").endOf("date").toISOString());
      IDB.forEach(async (element) => {
        // Select No Date & Overdue
        if ((element.end && new Date(element.end) <= current) || element.end === undefined) {
          // Select checked data
          if (element.checked && props.DB && element._id)
            await IndexedDB.move(props.DB, "todo", "completed", element._id);
        }
      });
      refreshData();
    }
  };

  const refreshData = async () => {
    if (props.DB) {
      const IDB = await IndexedDB.readAll<IData>(props.DB, "todo");
      const tempData: ISortedData[] = [];
      const endArr: string[] = [];

      IDB.forEach(async (element) => {
        let key = element.end ? element.end.toISOString() : "0000";
        const current = new Date(moment(new Date()).subtract(1, "d").endOf("date").toISOString());

        // Overdue
        if (key !== "0000" && new Date(key) <= current) key = "0001";

        const index = endArr.findIndex((E) => E === key);
        if (index === -1) {
          // No exist in endArr
          tempData.push({ end: key, data: [] });
          tempData[tempData.length - 1].data.push(element);
          endArr.push(key);
        } else {
          // Exist in endArr
          tempData[index].data.push(element);
        }
      });
      tempData.sort((a, b) => {
        if (a.end > b.end) return 1;
        else return -1;
      });
      setDataArr(tempData);
    }
  };

  const submit = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey === true) {
        setCalendar((prev) => (prev ? false : true));
      } else if (props.DB && inputStr !== "") {
        const data: IData = {
          updated: new Date(),
          content: inputStr,
          checked: false,
          end: calendar ? optionDate : undefined,
        };
        await IndexedDB.create(props.DB, "todo", data);
        setCalendar(false);
        setInputStr("");
        await refreshData();
      }
    }
  };

  // Initailize
  useEffect(() => {
    completedData();
    refreshData();

    return () => {
      completedData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.DB]);

  return (
    <>
      <div className="mainInputArea">
        <input
          className="mainInput"
          onKeyUp={submit}
          placeholder="💡 Please enter your idea!"
          value={inputStr}
          onChange={({ target }) => setInputStr(target.value)}
          autoFocus
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          ref={inputRef}
        />
        <FontAwesomeIcon
          className="calendar"
          icon={faCalendarDays}
          opacity={inputFocus ? 1 : 0}
          onClick={() => {
            if (inputRef.current !== null) {
              inputRef.current.focus();
            }
            setCalendar((prev) => (prev ? false : true));
          }}
        />
        <div className="calendarArea" style={calendar ? { height: "262px" } : { height: "0px" }}>
          <Calendar
            locale="en"
            calendarType="US"
            value={optionDate}
            onChange={(value: Date) => {
              if (inputRef.current !== null) {
                inputRef.current.focus();
              }
              setOptionDate(value);
            }}
          />
        </div>
      </div>
      <div className="todoListArea">
        {dataArr.map((element, index) => {
          return (
            <div key={index}>
              <p className="dateSeparator">
                {element.end === "0000"
                  ? "No Date"
                  : element.end === "0001"
                  ? "Overdue"
                  : moment(element.end).format("YYYY/MM/DD")}
              </p>
              {element.data.map((data) => {
                return (
                  <TodoList
                    key={data._id}
                    data={data}
                    DB={props.DB}
                    refreshData={refreshData}
                    setUndo={setUndo}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {undo ? (
        <UndoBtn undo={undo} setUndo={setUndo} refreshData={refreshData} DB={props.DB} />
      ) : null}
    </>
  );
}
