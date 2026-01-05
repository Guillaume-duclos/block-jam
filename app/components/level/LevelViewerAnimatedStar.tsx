import { Group, ImageSVG, SkSVG } from "@shopify/react-native-skia";
import { memo } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

const LevelViewerAnimatedStar = memo(
  ({
    svg,
    index,
    progress,
  }: {
    svg: SkSVG;
    index: number;
    progress: SharedValue<number>;
  }) => {
    const transform = useDerivedValue(() => {
      return [{ scale: progress.value }];
    });

    const opacity = useDerivedValue(() => {
      return progress.value;
    });

    const origin = { x: index * 19 + 8, y: 8 };

    return (
      <Group origin={origin} transform={transform} opacity={opacity}>
        <ImageSVG svg={svg} x={index * 19} y={0} width={16} height={16} />
      </Group>
    );
  }
);

export default LevelViewerAnimatedStar;
