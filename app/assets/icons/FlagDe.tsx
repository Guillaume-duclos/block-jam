import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  style?: ViewStyle;
};

export default function FlagDe({ style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 500 500"
      style={{ width: 500, height: 500, ...style }}
    >
      <Path d="M500 0H0V500H500V0Z" fill="#000000" />
      <Path d="M500 166.667H0V500H500V166.667Z" fill="#FF0000" />
      <Path d="M500 333.333H0V500H500V333.333Z" fill="#FFCC00" />
    </Svg>
  );
}
