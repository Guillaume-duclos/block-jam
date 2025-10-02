import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  style?: ViewStyle;
};

export default function FlagIt({ style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 600 600"
      style={{ width: 600, height: 600, ...style }}
    >
      <Path d="M200 0H0V600H200V0Z" fill="#009246" />
      <Path d="M400 0H200V600H400V0Z" fill="#FFFFFF" />
      <Path d="M600 0H400V600H600V0Z" fill="#CE2B37" />
    </Svg>
  );
}
