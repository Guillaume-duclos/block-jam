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
  from: { opacity: 0, transform: [{ scale: 0.7 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
});

const fadeOutKeyframes = css.keyframes({
  from: { opacity: 1, transform: [{ scale: 1 }] },
  to: { opacity: 0, transform: [{ scale: 0.7 }] },
});

const arrowSlideAnimation = css.create({
  slide: {
    animationName: slideKeyframes,
    animationDelay: "1s",
    animationDuration: "1.2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationFillMode: "none",
  },
});

const arrowFadeAnimation = css.create({
  fade: {
    animationName: [fadeInKeyframes, fadeOutKeyframes],
    animationDelay: ["1s", "4.7s"],
    animationDuration: ["0.25s", "0.25s"],
    animationTimingFunction: ["ease-out", "ease-in"],
    animationIterationCount: [1, 1],
    animationFillMode: ["both", "forwards"],
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
          <View
            key={index}
            style={{
              ...styles.grid,
              width: caseSize - 5,
              height: caseSize - 5,
              top: row * caseSize + 2,
              left: col * caseSize + 2,
              borderColor: darken(color, 0.27),
              ...(index === goalCaseIndex && {
                borderColor: lighten(mainBlockColor),
                borderWidth: 2,
              }),
            }}
          >
            {index === goalCaseIndex && showArrow && (
              <Animated.View
                style={[
                  styles.arrowGoalCaseIndicatorContainer,
                  arrowSlideAnimation.slide,
                ]}
              >
                <Animated.View style={arrowFadeAnimation.fade}>
                  <ArrowTriangleLeftFill
                    color={lighten(mainBlockColor)}
                    style={styles.arrowGoalCaseIndicator}
                  />
                </Animated.View>
              </Animated.View>
            )}

            {index === goalCaseIndex && (
              <StarFill
                style={{ width: 22, height: 22 }}
                color={lighten(mainBlockColor)}
              />
            )}
          </View>
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
  arrowGoalCaseIndicatorContainer: {
    top: (caseSize - 4) / 2 - 18 / 2 - 2,
    right: -35,
    position: "absolute",
  },
  arrowGoalCaseIndicator: {
    width: 18,
    height: 18,
  },
});
