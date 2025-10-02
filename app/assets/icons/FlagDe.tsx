import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  style?: ViewStyle;
};

export default function FlagDe({ style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 600 600"
      style={{ width: 600, height: 600, ...style }}
    >
      <Path d="M600 0H0V600H600V0Z" fill="#000000" />
      <Path d="M600 200H0V600H600V200Z" fill="#FF0000" />
      <Path d="M600 400H0V600H600V400Z" fill="#FFCC00" />
    </Svg>
  );
}
