import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInterval } from "../hooks";
import IndexedDB from "../indexedDB";
import { IData } from "../type";

interface IProps {
  undo: IData | undefined;
  setUndo: React.Dispatch<React.SetStateAction<IData | undefined>>;
  refreshData: () => Promise<void>;
  DB?: IDBDatabase;
}

export default function UndoBtn(props: IProps) {
  const undoData = async () => {
    if (props.DB && props.undo) {
      await IndexedDB.create(props.DB, "todo", props.undo);
      props.refreshData();
      props.setUndo(undefined);
    }
  };

  useInterval(() => {
    props.setUndo(undefined);
  }, 3000);

  return (
    <button className="undoBtn" onClick={undoData}>
      <FontAwesomeIcon className="undoIcon" icon={faRotateLeft} />
    </button>
  );
}
