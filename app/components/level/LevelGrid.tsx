import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { css } from "react-native-reanimated";
import ArrowTriangleLeftFill from "../../assets/icons/ArrowTriangleLeftFill";
import StarFill from "../../assets/icons/StarFill";
import { goalCaseIndex } from "../../config/config";
import { caseSize } from "../../constants/dimension";
import { useDificultyStore } from "../../store/dificulty.store";
import { darken, lighten } from "../../utils/color";

const slideKeyframes = css.keyframes({
  "0%": { transform: [{ translateX: 0 }] },
  "50%": { transform: [{ translateX: -12 }] },
  "100%": { transform: [{ translateX: 0 }] },
});

const fadeInKeyframes = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOutKeyframes = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const arrowAnimation = css.create({
  slide: {
    animationName: [slideKeyframes, fadeInKeyframes, fadeOutKeyframes],
    animationDelay: ["1s", "1s", "4.7s"],
    animationDuration: ["1.2s", "0.3s", "0.3s"],
    animationTimingFunction: ["ease-in-out", "ease-out", "ease-in"],
    animationIterationCount: ["infinite", 1, 1],
    animationFillMode: ["none", "both", "forwards"],
  },
});

type Props = {
  color: string;
  style?: ViewStyle;
};

export default function LevelGrid({ color, style }: Props): JSX.Element {
  const dificultyTheme = useDificultyStore((value) => value.colors);
  const mainBlockColor = dificultyTheme?.mainBlock;

  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ ...styles.gridContainer, ...style }}>
      {[...Array(36)].map((_, index: number) => {
        const col = index % 6;
        const row = Math.floor(index / 6);

        return (
          <>
            {index === goalCaseIndex && showArrow && (
              <Animated.View
                style={[
                  {
                    top: 140,
                    right: -30,
                    position: "absolute",
                  },
                  arrowAnimation.slide,
                ]}
              >
                <ArrowTriangleLeftFill
                  color={lighten(mainBlockColor)}
                  style={{ width: 18 }}
                />
              </Animated.View>
            )}

            <View
              key={index}
              style={{
                ...styles.grid,
                width: caseSize - 5,
                height: caseSize - 5,
                top: row * caseSize + 2,
                left: col * caseSize + 2,
                borderColor: darken(color, 0.3),
                ...(index === goalCaseIndex && {
                  borderColor: lighten(mainBlockColor),
                  borderWidth: 2,
                  opacity: 0.75,
                }),
              }}
            >
              {index === goalCaseIndex && (
                <StarFill
                  style={{ width: 22, height: 22 }}
                  color={lighten(mainBlockColor)}
                />
              )}
            </View>
          </>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    top: 10,
    left: 10,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  grid: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
  goalCase: {
    borderWidth: 2,
  },
});
