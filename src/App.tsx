import moment from "moment";
import { useEffect, useState } from "react";
import Additional from "./components/additional";
import IndexedDB from "./indexedDB";
import Scheduler from "./scheduler";
import "./styles/App.scss";
import { IData } from "./type";

interface ISortedData {
  end: string;
  data: IData[];
}

function App() {
  const [IDB, setIDB] = useState<IDBDatabase>();
  const [dataArr, setDataArr] = useState<ISortedData[]>([]);

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

  // Open DB
  useEffect(() => {
    const openDB = async () => {
      try {
        const DB = await IndexedDB.open("CWS", 2);
        setIDB(DB);
      } catch (err) {
        console.error(err);
        // maybe need to refresh or retry openDB
      }
    };
    openDB();
  }, []);

  return (
    <div className="webScheduler">
      <Scheduler DB={IDB} dataArr={dataArr} refresh={refreshData} />
      <Additional DB={IDB} refresh={refreshData} />
    </div>
  );
}

export default App;
