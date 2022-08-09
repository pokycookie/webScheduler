import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface IProps {
  checked?: boolean;
}

export default function Checkbox(props: IProps) {
  const [check, setCheck] = useState<boolean>(props.checked || false);

  const clickHandler = () => {
    setCheck((prev) => (prev ? false : true));
  };

  return (
    <FontAwesomeIcon
      className="_checkbox"
      icon={check ? faSquareCheck : faSquare}
      onClick={clickHandler}
    />
  );
}
