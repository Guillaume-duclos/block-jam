import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  style?: ViewStyle;
};

export default function FlagFr({ style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 600 600"
      style={{ width: 600, height: 600, ...style }}
    >
      <Path d="M600 0H0V600H600V0Z" fill="#CE1126" />
      <Path d="M400 0H0V600H400V0Z" fill="#FFFFFF" />
      <Path d="M200 0H0V600H200V0Z" fill="#002654" />
    </Svg>
  );
}
