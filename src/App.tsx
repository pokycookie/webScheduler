import { useEffect, useState } from "react";
import IndexedDB from "./indexedDB";
import Scheduler from "./scheduler";
import "./styles/App.scss";

function App() {
  // Turn on or off extension
  const [power, setPower] = useState<boolean>(true);
  const [IDB, setIDB] = useState<IDBDatabase>();

  // Open DB
  useEffect(() => {
    const openDB = async () => {
      try {
        const DB = await IndexedDB.open("CWS", 1);
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
      <Scheduler power={power} setPower={setPower} DB={IDB} />
    </div>
  );
}

export default App;
