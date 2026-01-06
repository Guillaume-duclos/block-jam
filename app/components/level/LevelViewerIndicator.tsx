import {
  FontWeight,
  Group,
  ImageSVG,
  Paragraph,
  RoundedRect,
  Skia,
  TextAlign,
} from "@shopify/react-native-skia";
import React, { JSX, memo, useEffect, useMemo, useRef } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import DificultyColors from "../../types/dificultyColors.type";
import { darken } from "../../utils/color";

type Props = {
  level: number;
  score: number | undefined;
  isFocused: boolean;
  colors: DificultyColors;
};

const SPRING_CONFIG = {
  mass: 1,
  damping: 19,
  stiffness: 200,
};

const LevelViewerIndicator = memo(
  ({ level, score, isFocused, colors }: Props): JSX.Element => {
    const progressTrophy = useSharedValue(0);
    const progressContainer = useSharedValue(20);
    const progressSubContainer = useSharedValue(16);

    const prevScoreRef = useRef(score);

    const trophyFill = useMemo(
      () =>
        Skia.SVG.MakeFromString(
          `<svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3.31204C0 2.79015 0.153374 2.382 0.460123 2.08759C0.773688 1.79319 1.20314 1.64599 1.74847 1.64599H3.73211C3.81391 1.13078 4.03545 0.729319 4.39673 0.441606C4.76483 0.147202 5.25562 0 5.86912 0H14.1309C14.7512 0 15.242 0.147202 15.6033 0.441606C15.9646 0.729319 16.1861 1.13078 16.2679 1.64599H18.2515C18.7969 1.64599 19.2229 1.79319 19.5297 2.08759C19.8432 2.382 20 2.79015 20 3.31204C20 4.69039 19.7751 5.90146 19.3252 6.94526C18.8753 7.98236 18.2004 8.85888 17.3006 9.57482C16.4008 10.2908 15.2761 10.8528 13.9264 11.2609C13.6128 11.6423 13.2822 11.9869 12.9346 12.2947C12.5869 12.5958 12.2393 12.8534 11.8916 13.0675V17.4334H13.4867C14.2093 17.4334 14.7546 17.6241 15.1227 18.0055C15.4976 18.3869 15.6851 18.9121 15.6851 19.5812V21.2372C15.6851 21.4647 15.6067 21.6487 15.4499 21.7892C15.2931 21.9297 15.1091 22 14.8978 22H5.10225C4.89093 22 4.70688 21.9297 4.5501 21.7892C4.39332 21.6487 4.31493 21.4647 4.31493 21.2372V19.5812C4.31493 18.9121 4.49898 18.3869 4.86708 18.0055C5.24199 17.6241 5.78732 17.4334 6.50307 17.4334H8.10838V13.0675C7.76074 12.8534 7.41309 12.5958 7.06544 12.2947C6.71779 11.9869 6.38378 11.6423 6.06339 11.2609C4.7137 10.8528 3.58896 10.2908 2.68916 9.57482C1.79618 8.85888 1.12474 7.98236 0.674847 6.94526C0.224949 5.90146 0 4.69039 0 3.31204ZM1.46217 3.45255C1.46217 4.88443 1.73824 6.08881 2.29039 7.06569C2.84254 8.04258 3.65372 8.79532 4.72393 9.32391C4.41036 8.70833 4.15815 8.04927 3.96728 7.34672C3.77641 6.63747 3.68098 5.89811 3.68098 5.12865V3.1615H1.75869C1.67007 3.1615 1.5985 3.19161 1.54397 3.25182C1.48943 3.30535 1.46217 3.37226 1.46217 3.45255ZM15.2658 9.32391C16.3429 8.79532 17.1575 8.04258 17.7096 7.06569C18.2618 6.08881 18.5378 4.88443 18.5378 3.45255C18.5378 3.37226 18.5106 3.30535 18.456 3.25182C18.4015 3.19161 18.3299 3.1615 18.2413 3.1615H16.319V5.12865C16.319 5.89811 16.2236 6.63747 16.0327 7.34672C15.8419 8.04927 15.5862 8.70833 15.2658 9.32391Z" fill="${darken(
              colors.primary,
              0.45
            )}"/>
          </svg>`
        ),
      []
    );

    const paragraph = useMemo(() => {
      const fontStyle = {
        fontSize: 13,
        fontFamilies: ["Rubik"],
        color: Skia.Color(darken(colors.primary, 0.45)),
      };

      const text = Skia.ParagraphBuilder.Make({
        maxLines: 1,
        textAlign: level < 9 ? TextAlign.Center : TextAlign.Left,
      })
        .pushStyle({ ...fontStyle, fontStyle: { weight: FontWeight.Bold } })
        .addText(String(level + 1))
        .build();

      text.layout(100);

      return text;
    }, [level]);

    const textWidth = paragraph?.getLongestLine();
    const width = textWidth ? (level < 9 ? 16 : textWidth + 8) : 16;
    const trophyWidth = 10;
    const borderWidth = 4;

    useEffect(() => {
      if (score && textWidth && score === prevScoreRef.current) {
        progressTrophy.value = 1;
        progressContainer.value = width + borderWidth + trophyWidth + 4;
        progressSubContainer.value = width + borderWidth + trophyWidth;
      } else {
        progressTrophy.value = 0;
        progressContainer.value = width + 4;
        progressSubContainer.value = width;
      }
    }, [score, textWidth]);

    useEffect(() => {
      if (!isFocused || score === prevScoreRef.current || !width) {
        return;
      }

      const newContainerSize = width + borderWidth + trophyWidth + 4;
      const newSubContainerSize = width + borderWidth + trophyWidth;

      prevScoreRef.current = score;

      progressContainer.value = withDelay(
        1000,
        withSpring(newContainerSize, SPRING_CONFIG)
      );

      progressSubContainer.value = withDelay(
        1000,
        withSpring(newSubContainerSize, SPRING_CONFIG)
      );

      progressTrophy.value = withDelay(1300, withSpring(1, SPRING_CONFIG));
    }, [score, isFocused, textWidth]);

    const containerWidth = useDerivedValue(() => {
      return progressContainer.value;
    });

    const subContainerWidth = useDerivedValue(() => {
      return progressSubContainer.value;
    });

    const trophyOpacity = useDerivedValue(() => {
      return progressTrophy.value;
    });

    const trophyScale = useDerivedValue(() => {
      return [{ scale: progressTrophy.value }];
    });

    const origin = { x: width + trophyWidth / 2, y: width / 2 };

    return (
      <Group transform={[{ translateX: 4 }, { translateY: 72 - 20 }]}>
        <RoundedRect
          x={-2}
          y={-2}
          r={10}
          width={containerWidth || 0}
          height={20}
          color={darken(colors.primary, 0.25)}
        />

        <RoundedRect
          x={0}
          y={0}
          r={8}
          width={subContainerWidth}
          height={16}
          color={colors.white}
        >
          <Paragraph
            paragraph={paragraph}
            x={level === 0 ? -0.5 : level < 9 ? 0 : borderWidth}
            y={0.5}
            width={level < 9 ? 16 : 100}
          />

          <ImageSVG
            svg={trophyFill}
            x={width}
            y={2}
            width={trophyWidth}
            height={12}
            opacity={trophyOpacity}
            transform={trophyScale}
            origin={origin}
          />
        </RoundedRect>
      </Group>
    );
  }
);

export default LevelViewerIndicator;
