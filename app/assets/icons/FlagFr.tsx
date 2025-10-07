import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  style?: ViewStyle;
};

export default function FlagFr({ style }: Props) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 500 500"
      style={{ width: 500, height: 500, ...style }}
    >
      <Path d="M500 0H0V500H500V0Z" fill="#CE1126" />
      <Path d="M333.333 0H0V500H333.333V0Z" fill="#FFFFFF" />
      <Path d="M166.667 0H0V500H166.667V0Z" fill="#002654" />
    </Svg>
  );
}
