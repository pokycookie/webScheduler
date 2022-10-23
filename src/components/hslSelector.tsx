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
  const [hueOffset, setHueOffset] = useState(props.default ? getOffsetRatio(props.default) : 0);
  const [hue, setHue] = useState(props.default || 0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(65);

  const hueClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const offsetX = e.nativeEvent.offsetX;
    const tempHue = Math.ceil((offsetX / width) * 360);
    if (offsetX > 0 && tempHue > 0 && tempHue < 360) {
      setHueOffset(offsetX);
      setHue(tempHue);
    }
  };

  const hueWheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      if (hue < 360) {
        setHue((prev) => prev + 1);
        setHueOffset(((hue + 1) / 360) * width);
      }
    } else {
      if (hue > 0) {
        setHue((prev) => prev - 1);
        setHueOffset(((hue - 1) / 360) * width);
      }
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange({ hue, saturation: 100, lightness: 65 });
  }, [hue, props]);

  return (
    <div className="hslSelector">
      <p>{hue}</p>
      <div className="rainbow element" onClick={hueClickHandler} onWheel={hueWheelHandler}>
        <div className="selector" style={{ left: hueOffset - 7 }}></div>
      </div>
      <div
        className="element"
        style={{
          background: `linear-gradient(90deg, hsl(${hue}, ${saturation}%, 0%) 0%, hsl(${hue}, ${saturation}%, 100%) 100%)`,
        }}
      >
        <div className="selector"></div>
      </div>
      <div
        className="element"
        style={{
          background: `linear-gradient(90deg, hsl(${hue}, 0%, ${lightness}%) 0%, hsl(${hue}, 100%, ${lightness}%) 100%)`,
        }}
      >
        <div className="selector"></div>
      </div>
    </div>
  );
}
