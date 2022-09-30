interface IProps {
  onChange?: (hue: number) => void;
}

export default function HslSelector(props: IProps) {
  return <div className="hslSelector"></div>;
}
