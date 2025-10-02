import { ViewStyle } from "react-native";
import Svg, { ClipPath, Defs, G, Mask, Path, Rect } from "react-native-svg";

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
      <G clip-Path="url(#clip0_150_113)">
        <Path d="M0 0V600H600V0H0Z" fill="#012169" />
        <Path d="M0 0L600 600ZM600 0L0 600Z" fill="black" />
        <Path d="M0 0L600 600M600 0L0 600" stroke="white" stroke-width="120" />
        <Mask
          id="mask0_150_113"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="600"
          height="600"
        >
          <Path
            d="M300 300H600V600L300 300ZM300 300V600H0L300 300ZM300 300H0V0L300 300ZM300 300V0H600L300 300Z"
            fill="white"
          />
        </Mask>
        <G mask="url(#mask0_150_113)">
          <Path d="M0 0L600 600ZM600 0L0 600Z" fill="black" />
          <Path
            d="M0 0L600 600M600 0L0 600"
            stroke="#C8102E"
            stroke-width="80"
          />
        </G>
        <Path d="M300 0V600ZM0 300H600Z" fill="black" />
        <Path d="M300 0V600M0 300H600" stroke="white" stroke-width="200" />
        <Path d="M300 0V600ZM0 300H600Z" fill="black" />
        <Path d="M300 0V600M0 300H600" stroke="#C8102E" stroke-width="120" />
      </G>
      <Defs>
        <ClipPath id="clip0_150_113">
          <Rect width="600" height="600" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
