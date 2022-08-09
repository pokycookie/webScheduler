import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  power: boolean;
  setPower: Dispatch<SetStateAction<boolean>>;
}

export default function Scheduler(props: IProps) {
  const powerBtnHandler = () => {
    props.setPower((prev) => (prev ? false : true));
  };

  const submit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey === true) {
        console.log("Shift + Enter");
      } else {
        console.log("Enter");
      }
    }
  };

  return (
    <div
      className="scheduler"
      style={{
        transform: props.power ? `translateX(0px)` : "translateX(330px)",
      }}
    >
      <button className="powerBtn" onClick={powerBtnHandler}></button>
      <div className="main">
        <header>
          <FontAwesomeIcon className="menu" icon={faBars} />
        </header>
        <input onKeyUp={submit} placeholder="💡 Please enter your idea!" />
      </div>
    </div>
  );
}
