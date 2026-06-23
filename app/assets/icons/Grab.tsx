import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  style?: ViewStyle;
};

export default function Grab({ color, style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 19 15"
      style={{ width: 19, height: 15, ...style }}
    >
      <Path
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        d="M1.5 1.5V13.5M9.5 1.5V13.5M17.5 1.5V13.5"
      />
    </Svg>
  );
}
