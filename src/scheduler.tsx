import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { shallowEqual, useSelector } from "react-redux";
import TodoList from "./components/todoList";
import UndoBtn from "./components/undoBtn";
import IndexedDB from "./indexedDB";
import { IReduxStore } from "./redux";
import { IColor, IData } from "./type";

interface IProps {
  DB?: IDBDatabase;
  dataArr: ISortedData[];
  refresh: () => Promise<void>;
}

interface ISortedData {
  end: string;
  data: IData[];
}

export default function Scheduler(props: IProps) {
  const [inputStr, setInputStr] = useState<string>("");
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<boolean>(false);
  const [optionDate, setOptionDate] = useState(new Date());
  const [undo, setUndo] = useState<IData>();

  const inputRef = useRef<HTMLInputElement>(null);
  const colorObj = useSelector<IReduxStore, IColor>((state) => {
    return state.color;
  }, shallowEqual);

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
      props.refresh();
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
        await props.refresh();
      }
    }
  };

  // Initailize
  useEffect(() => {
    completedData();
    props.refresh();

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
          style={{ backgroundColor: colorObj.lightest }}
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
      <div className="todoListArea" style={{ backgroundColor: colorObj.lighter }}>
        {props.dataArr.map((element, index) => {
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
                    refreshData={props.refresh}
                    setUndo={setUndo}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {undo ? (
        <UndoBtn undo={undo} setUndo={setUndo} refreshData={props.refresh} DB={props.DB} />
      ) : null}
    </>
  );
}
