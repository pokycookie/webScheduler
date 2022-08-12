import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IProps {
  checked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Checkbox(props: IProps) {
  return (
    <FontAwesomeIcon
      className="_checkbox"
      icon={props.checked ? faSquareCheck : faSquare}
      style={{ color: props.checked ? "#590696" : "white" }}
      onClick={props.onClick}
    />
  );
}
