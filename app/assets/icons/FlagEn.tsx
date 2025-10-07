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
      <Path d="M500.01 0H0V500.01H500.01V0Z" fill="#000066" />
      <Path
        d="M0 0V55.9028L444.109 500.012H500.01V444.111L55.9011 0.0016667L0 0ZM500.01 0V55.9011L55.9011 500.01H0V444.109L444.109 0H500.01Z"
        fill="#FFFFFF"
      />
      <Path
        d="M208.337 0V500.01H291.672V0H208.337ZM0 166.67V333.34H500.01V166.67H0Z"
        fill="#FFFFFF"
      />
      <Path
        d="M0 200.004V300.006H500.01V200.004H0ZM225.004 0V500.01H275.005V0H225.004Z"
        fill="#CC0000"
      />
      <Path
        d="M0 500.01L166.67 333.34H203.937L37.2674 500.01H0ZM0 0L166.67 166.67H129.403L0 37.2691L0 0ZM296.073 166.67L462.743 0H500.01L333.34 166.67H296.073ZM500.01 500.01L333.34 333.34H370.607L500.01 462.743V500.01Z"
        fill="#CC0000"
      />
    </Svg>
  );
}
