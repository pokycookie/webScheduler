import { faBars, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import TodoList from "./components/todoList";
import IndexedDB from "./indexedDB";
import { IData } from "./type";

interface IProps {
  power: boolean;
  setPower: Dispatch<SetStateAction<boolean>>;
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

  const inputRef = useRef<HTMLInputElement>(null);

  const refreshData = async () => {
    if (props.DB) {
      const IDB = await IndexedDB.readAll(props.DB, "todo");
      const tempData: ISortedData[] = [];
      const endArr: string[] = [];

      IDB.forEach((element) => {
        const key = element.end ? element.end.toISOString() : "0000";
        const index = endArr.findIndex((E) => E === key);
        if (index === -1) {
          tempData.push({ end: key, data: [] });
          tempData[tempData.length - 1].data.push(element);
          endArr.push(key);
        } else {
          tempData[index].data.push(element);
        }
      });
      tempData.sort((a, b) => {
        if (a.end > b.end) return 1;
        else return -1;
      });
      console.log(tempData);
      setDataArr(tempData);
    }
  };

  const powerBtnHandler = () => {
    props.setPower((prev) => (prev ? false : true));
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
        IndexedDB.create(props.DB, "todo", data);
        setCalendar(false);
        setInputStr("");
        await refreshData();
      }
    }
  };

  // Initailize
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.DB]);

  return (
    <>
      {/* <button className="powerBtn" onClick={powerBtnHandler}></button> */}
      {/* <header>
        <FontAwesomeIcon className="menu" icon={faBars} />
      </header> */}
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
        <div
          className="calendarArea"
          style={calendar ? { height: "262px" } : { height: "0px" }}
        >
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
                  : moment(element.end).format("YYYY/MM/DD")}
              </p>
              {element.data.map((data) => {
                return (
                  <TodoList
                    key={data._id}
                    data={data}
                    DB={props.DB}
                    refreshData={refreshData}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
