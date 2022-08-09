import { useState } from "react";
import Scheduler from "./scheduler";
import "./styles/App.scss";

function App() {
  // Turn on or off extension
  const [power, setPower] = useState<boolean>(false);

  return (
    <div className="webScheduler">
      <Scheduler power={power} setPower={setPower} />
    </div>
  );
}

export default App;
