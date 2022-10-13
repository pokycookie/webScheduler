import { useEffect, useState } from "react";
import "../styles/hslSelector.scss";
import { IHSL } from "../type";

interface IProps {
  onChange?: (hslObj: IHSL) => void;
  default?: number;
}

const width = 310;

const getOffsetRatio = (hue: number) => {
  return (hue / 360) * width;
};

export default function HslSelector(props: IProps) {
  const [offset, setOffset] = useState(props.default ? getOffsetRatio(props.default) : 0);
  const [hue, setHue] = useState(props.default || 0);

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const offsetX = e.nativeEvent.offsetX;
    // const width = e.currentTarget.clientWidth;
    const tempHue = Math.ceil((offsetX / width) * 360);
    if (offsetX > 0 && tempHue > 0 && tempHue < 360) {
      setOffset(offsetX);
      setHue(tempHue);
    }
  };

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      if (hue < 360) {
        setHue((prev) => prev + 1);
        setOffset(((hue + 1) / 360) * width);
      }
    } else {
      if (hue > 0) {
        setHue((prev) => prev - 1);
        setOffset(((hue - 1) / 360) * width);
      }
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange({ hue, saturation: 100, lightness: 65 });
  }, [hue, props]);

  return (
    <div className="hslSelector">
      <div className="rainbow" onClick={clickHandler} onWheel={wheelHandler}>
        <div className="selector" style={{ left: offset - 7 }}></div>
      </div>
    </div>
  );
}
