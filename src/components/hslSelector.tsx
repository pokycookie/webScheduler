import { useEffect, useState } from "react";
import "../styles/hslSelector.scss";
import { IHSL } from "../type";

interface IProps {
  onChange?: (hslObj: IHSL) => void;
  default?: IHSL;
}

type hslElement = "hue" | "saturation" | "lightness";

const width = 310;

const getOffsetRatio = (value: number, max: number) => {
  return (value / max) * width;
};

export default function HslSelector(props: IProps) {
  const [hueOffset, setHueOffset] = useState(
    props.default ? getOffsetRatio(props.default.hue, 360) : 0
  );
  const [saturationOffset, setSaturationOffset] = useState(
    props.default ? getOffsetRatio(props.default.saturation, 100) : 0
  );
  const [lightnessOffset, setLightnessOffset] = useState(
    props.default ? getOffsetRatio(props.default.lightness, 100) : 0
  );
  const [hue, setHue] = useState(props.default ? props.default.hue : 0);
  const [saturation, setSaturation] = useState(props.default ? props.default.saturation : 0);
  const [lightness, setLightness] = useState(props.default ? props.default.lightness : 0);

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: hslElement) => {
    const offsetX = e.nativeEvent.offsetX;
    let target = hue;
    let max = 360;
    let setTarget = setHue;
    let setOffset = setHueOffset;

    switch (type) {
      case "hue":
        target = hue;
        max = 360;
        setTarget = setHue;
        setOffset = setHueOffset;
        break;
      case "saturation":
        target = saturation;
        max = 100;
        setTarget = setSaturation;
        setOffset = setSaturationOffset;
        break;
      case "lightness":
        target = lightness;
        max = 100;
        setTarget = setLightness;
        setOffset = setLightnessOffset;
        break;
    }

    const temp = Math.ceil((offsetX / width) * max);
    if (offsetX > 0 && temp > 0 && temp < max) {
      setOffset(offsetX);
      setTarget(temp);
    }
  };

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>, type: hslElement) => {
    let target = hue;
    let max = 360;
    let setTarget = setHue;
    let setOffset = setHueOffset;

    switch (type) {
      case "hue":
        target = hue;
        max = 360;
        setTarget = setHue;
        setOffset = setHueOffset;
        break;
      case "saturation":
        target = saturation;
        max = 100;
        setTarget = setSaturation;
        setOffset = setSaturationOffset;
        break;
      case "lightness":
        target = lightness;
        max = 100;
        setTarget = setLightness;
        setOffset = setLightnessOffset;
        break;
    }

    if (e.deltaY < 0) {
      if (target < max) {
        setTarget((prev) => prev + 1);
        setOffset(((target + 1) / max) * width);
      }
    } else {
      if (target > 0) {
        setTarget((prev) => prev - 1);
        setOffset(((target - 1) / max) * width);
      }
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange({ hue, saturation, lightness });
  }, [hue, saturation, lightness, props]);

  return (
    <div className="hslSelector">
      <div
        className="rainbow element"
        onClick={(e) => clickHandler(e, "hue")}
        onWheel={(e) => wheelHandler(e, "hue")}
      >
        <div className="selector" style={{ left: hueOffset - 7 }}></div>
      </div>
      <div
        className="element"
        onClick={(e) => clickHandler(e, "saturation")}
        onWheel={(e) => wheelHandler(e, "saturation")}
        style={{
          background: `linear-gradient(90deg, hsl(${hue}, 0%, ${lightness}%) 0%, hsl(${hue}, 100%, ${lightness}%) 100%)`,
        }}
      >
        <div className="selector" style={{ left: saturationOffset - 7 }}></div>
      </div>
      <div
        className="element"
        onClick={(e) => clickHandler(e, "lightness")}
        onWheel={(e) => wheelHandler(e, "lightness")}
        style={{
          background: `linear-gradient(90deg, hsl(${hue}, ${saturation}%, 0%) 0%, hsl(${hue}, ${saturation}%, 100%) 100%)`,
        }}
      >
        <div className="selector" style={{ left: lightnessOffset - 7 }}></div>
      </div>
      <p>
        HSL({hue}, {saturation}, {lightness})
      </p>
    </div>
  );
}
