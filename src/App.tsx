import { useEffect, useState } from "react";
import Additional from "./components/additional";
import IndexedDB from "./indexedDB";
import Scheduler from "./scheduler";
import "./styles/App.scss";

function App() {
  const [IDB, setIDB] = useState<IDBDatabase>();

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
      <Scheduler DB={IDB} />
      <Additional DB={IDB} />
    </div>
  );
}

export default App;
