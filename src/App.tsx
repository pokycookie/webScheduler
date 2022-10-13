import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Additional from "./components/additional";
import IndexedDB from "./indexedDB";
import { getColorObj } from "./lib";
import { IReduxStore, RSetColor } from "./redux";
import Scheduler from "./scheduler";
import "./styles/App.scss";
import { IColor, IData, IHSL } from "./type";

interface ISortedData {
  end: string;
  data: IData[];
}

function App() {
  const [IDB, setIDB] = useState<IDBDatabase>();
  const [dataArr, setDataArr] = useState<ISortedData[]>([]);
  const [colorObj, setColorObj] = useState<IColor>(getColorObj(0, 100, 65));

  const dispatch = useDispatch();
  const hslObj = useSelector<IReduxStore, IHSL>((state) => {
    return state.color;
  }, shallowEqual);

  // Refresh data
  const refreshData = async () => {
    if (IDB) {
      const DB = await IndexedDB.readAll<IData>(IDB, "todo");
      const tempData: ISortedData[] = [];
      const endArr: string[] = [];

      DB.forEach(async (element) => {
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

  useEffect(() => {
    const colorObj = getColorObj(hslObj.hue, hslObj.saturation, hslObj.lightness);
    setColorObj(colorObj);
  }, [hslObj]);

  // Setting
  useEffect(() => {
    const setting = async () => {
      if (IDB) {
        const colorSetting = await IndexedDB.findSetting<IHSL>(IDB, "color");
        dispatch(RSetColor(colorSetting));
      }
    };
    setting();
  }, [IDB]);

  // // Set colorObj
  // useEffect(() => {
  //   const colorObj = getColorObj(hue);

  //   const updateDB = async () => {
  //     if (IDB) await IndexedDB.updateSetting<IColor>(IDB, "color", colorObj);
  //   };
  //   updateDB();
  // }, [hue]);

  // Open DB
  useEffect(() => {
    const openDB = async () => {
      try {
        const DB = await IndexedDB.open("CWS", 3);
        setIDB(DB);
      } catch (err) {
        console.error(err);
        // maybe need to refresh or retry openDB
      }
    };
    openDB();
  }, []);

  return (
    <div className="webScheduler" style={{ backgroundColor: colorObj.normal }}>
      <Scheduler DB={IDB} dataArr={dataArr} refresh={refreshData} />
      <Additional DB={IDB} refresh={refreshData} />
    </div>
  );
}

export default App;
