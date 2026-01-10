import { useIsFocused } from "@react-navigation/native";
import {
  BlurMask,
  Canvas,
  Group,
  ImageSVG,
  LinearGradient,
  RoundedRect,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { JSX, memo, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  Gesture,
  GestureDetector,
  TapGesture,
} from "react-native-gesture-handler";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { gridCount } from "../../config/config";
import { BlockType } from "../../enums/blockType.enum";
import { Orientation } from "../../enums/orientation.enum";
import { useLevelStore } from "../../store/level.store";
import DificultyColors from "../../types/dificultyColors.type";
import { darken } from "../../utils/color";
import LevelViewerIndicator from "./LevelViewerIndicator";
import LevelViewerStars from "./LevelViewerStars";

type Props = {
  level: number;
  difficulty: number;
  scheme: string;
  locked?: boolean;
  colors: DificultyColors;
  onPress: () => void;
  style?: ViewStyle;
};

type BlockData = {
  label: string;
  position: number[];
  orientation?: Orientation;
};

const LevelViewer = memo(
  ({
    level,
    difficulty,
    scheme,
    locked,
    colors,
    onPress,
    style,
  }: Props): JSX.Element => {
    const isFocused = useIsFocused();

    const translateY = useSharedValue(0);

    const score = useLevelStore(
      (state) => state.getScore(difficulty, level)?.score
    );

    const [vehiclePositions, setVehiclePositions] = useState<BlockData[]>([]);
    const [yNumber, setYNumber] = useState<number>(0);

    useEffect((): void => {
      computeBlockPositions();
    }, []);

    // Initialise les valeurs de vehiclePositions
    const computeBlockPositions = (): void => {
      // On récupère le niveau
      const level: string = scheme;

      // Initialisation du tableau de positions de tous les véhicules
      let positions: BlockData[] = [];

      // On parse toutes les lettres de la description de la grille
      for (let i: number = 0; i < level.length; i++) {
        // 1. On récupère le label
        const label: string = level.charAt(i);

        // 2. On vérifie si le label n'a pas déjà été inséré
        const previousSameLabel: number = positions.findIndex(
          (position): boolean => position.label === label
        );

        // 3. On récupère l'orientation
        let orientation: Orientation = Orientation.NULL;

        if (previousSameLabel === -1) {
          if (level[i + 1] === label) {
            orientation = Orientation.HORIZONTAL;
          } else {
            orientation = Orientation.VERTICAL;
          }
        }

        // 4. On ajoute les données pour chaque élément
        if (previousSameLabel !== -1) {
          positions[previousSameLabel].position.push(i);
        } else if (label === BlockType.EMPTY || label === BlockType.WALL) {
          positions.push({
            label,
            position: [i],
          });
        } else {
          positions.push({
            label,
            position: [i],
            orientation,
          });
        }
      }

      setVehiclePositions(positions);
    };

    const playgroundSize = 72;
    const playgroundGridSize = 72 - 8;
    const caseSize = (playgroundGridSize - 6) / 6;
    const gridOffsetX = 4 + 2;
    const gridOffsetY = 4 + 2;
    const gap = 2;
    const cellInner = caseSize - gap;
    const blockRadius = 2;

    const lockFill = useMemo(
      () =>
        Skia.SVG.MakeFromString(
          `<svg viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.09375 16.1484C1.46875 16.1484 0.994792 15.9818 0.671875 15.6484C0.354167 15.3151 0.195312 14.8099 0.195312 14.1328V8.32812C0.195312 7.65625 0.354167 7.15625 0.671875 6.82812C0.994792 6.49479 1.46875 6.32812 2.09375 6.32812H9.71094C10.3359 6.32812 10.8073 6.49479 11.125 6.82812C11.4479 7.15625 11.6094 7.65625 11.6094 8.32812V14.1328C11.6094 14.8099 11.4479 15.3151 11.125 15.6484C10.8073 15.9818 10.3359 16.1484 9.71094 16.1484H2.09375ZM1.73438 7.07812V4.55469C1.73438 3.6224 1.92188 2.83073 2.29688 2.17969C2.67708 1.52344 3.18229 1.02344 3.8125 0.679688C4.44271 0.335938 5.13802 0.164062 5.89844 0.164062C6.66406 0.164062 7.36198 0.335938 7.99219 0.679688C8.6224 1.02344 9.125 1.52344 9.5 2.17969C9.88021 2.83073 10.0703 3.6224 10.0703 4.55469V7.07812H8.21875V4.45312C8.21875 3.92708 8.11458 3.47917 7.90625 3.10938C7.69792 2.73438 7.41667 2.44792 7.0625 2.25C6.71354 2.05208 6.32552 1.95312 5.89844 1.95312C5.47135 1.95312 5.08333 2.05208 4.73438 2.25C4.38542 2.44792 4.10677 2.73438 3.89844 3.10938C3.69531 3.47917 3.59375 3.92708 3.59375 4.45312V7.07812H1.73438Z" fill="${colors.primary}"/>
          </svg>`
        ),
      []
    );

    // Rend les véhicules et les blocs
    const blocks = useMemo(() => {
      return vehiclePositions.flatMap(
        (data: BlockData, vehicleIndex: number) => {
          if (data.label === BlockType.EMPTY) return [];

          const firstPos = data.position[0];
          const colFirst = firstPos % gridCount;
          const rowFirst = Math.floor(firstPos / gridCount);

          const xStart = gridOffsetX + colFirst * caseSize;
          const yStart = gridOffsetY + rowFirst * caseSize;

          if (data.label !== BlockType.WALL) {
            const length = data.position.length;

            const width =
              data.orientation === Orientation.HORIZONTAL
                ? length * caseSize - gap
                : cellInner;

            const height =
              data.orientation === Orientation.HORIZONTAL
                ? cellInner
                : length * caseSize - gap;

            const gradientEnd =
              data.orientation === Orientation.HORIZONTAL
                ? vec(width, 0)
                : vec(0, height);

            const mainBlockColor =
              data.label === BlockType.MAIN_BLOCK
                ? colors.mainBlock
                : colors.frame;
            const secondBlockColor = darken(mainBlockColor, 0.08);

            return (
              <RoundedRect
                key={vehicleIndex}
                x={xStart + 2}
                y={yStart + 2}
                r={blockRadius}
                width={width}
                height={height}
                color={darken(mainBlockColor, 0.16)}
              >
                <RoundedRect
                  key={vehicleIndex}
                  x={xStart + 2}
                  y={yStart + 2}
                  r={blockRadius}
                  width={width}
                  height={height - 2}
                >
                  <LinearGradient
                    transform={[{ translateX: xStart }, { translateY: yStart }]}
                    start={vec(0, 0)}
                    end={gradientEnd}
                    colors={[secondBlockColor, mainBlockColor]}
                  />
                </RoundedRect>
              </RoundedRect>
            );
          } else {
            return data.position.map((position: number, blocIndex: number) => {
              const col = position % gridCount;
              const row = Math.floor(position / gridCount);

              const x = gridOffsetX + col * caseSize;
              const y = gridOffsetY + row * caseSize;

              const mainBlockColor = colors.fixedBlock;
              const secondBlockColor = darken(colors.fixedBlock, 0.08);

              return (
                <RoundedRect
                  key={`${vehicleIndex}-${blocIndex}`}
                  x={x + 2}
                  y={y + 2}
                  r={blockRadius}
                  width={cellInner}
                  height={cellInner}
                  color={darken(mainBlockColor, 0.16)}
                >
                  <RoundedRect
                    x={x + 2}
                    y={y + 2}
                    r={blockRadius}
                    width={cellInner}
                    height={cellInner - gap}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, cellInner)}
                      colors={[mainBlockColor, secondBlockColor]}
                      transform={[{ translateX: x + 2 }, { translateY: y + 2 }]}
                    />
                  </RoundedRect>
                </RoundedRect>
              );
            });
          }
        }
      );
    }, [vehiclePositions]);

    const panGesture: TapGesture = Gesture.Tap()
      .maxDuration(Number.MAX_SAFE_INTEGER)
      .onBegin(() => {
        translateY.value = withTiming(3, { duration: 80 });
      })
      .onEnd(() => {
        translateY.value = withTiming(0, { duration: 80 }, () => {
          runOnJS(onPress)();
        });
      })
      .onTouchesCancelled(() => {
        translateY.value = withTiming(0, { duration: 80 });
      })
      .runOnJS(true);

    useAnimatedReaction(
      () => translateY.value,
      (value) => {
        runOnJS(setYNumber)(value);
      }
    );

    return (
      <View style={{ ...styles.container, ...style }}>
        <GestureDetector gesture={panGesture}>
          <Canvas
            style={{
              ...styles.playgroundContainer,
              boxShadow: `0 6px 10px ${darken(colors.primary, 0.34)}`,
            }}
          >
            <RoundedRect
              x={0}
              y={7}
              r={10}
              width={playgroundSize}
              height={playgroundSize}
              color={darken(colors.frame, 0.16)}
            />

            <Group transform={[{ translateY: yNumber }]}>
              <RoundedRect
                x={0}
                y={0}
                r={10}
                width={playgroundSize}
                height={playgroundSize}
                color={darken(colors.frame, 0.1)}
              >
                <RoundedRect
                  x={4}
                  y={4}
                  r={6}
                  width={playgroundGridSize}
                  height={playgroundGridSize}
                  color={darken(colors.primary, 0.2)}
                />

                <Group>
                  {/* GRILLES */}
                  <Group transform={[{ translateX: 4 }, { translateY: 4 }]}>
                    {[...Array(36)].map((_, index: number) => {
                      const col = index % 6;
                      const row = Math.floor(index / 6);

                      return (
                        <RoundedRect
                          key={index}
                          x={row * caseSize + 4}
                          y={col * caseSize + 4}
                          r={blockRadius}
                          width={caseSize - gap}
                          height={caseSize - gap}
                          style="stroke"
                          strokeWidth={0.5}
                          strokeJoin="round"
                          color={darken(colors.primary, 0.3)}
                        />
                      );
                    })}
                  </Group>

                  {/* BLOCS */}
                  {blocks}

                  {/* FILTRE BLUR */}
                  {locked && <BlurMask blur={5} />}
                </Group>

                {locked && (
                  <ImageSVG
                    svg={lockFill}
                    x={72 / 2 - 11}
                    y={72 / 2 - 11}
                    width={22}
                    height={22}
                  />
                )}
              </RoundedRect>

              {/* NUMÉRO DU NIVEAU */}
              <LevelViewerIndicator
                level={level}
                score={score}
                isFocused={isFocused}
                colors={colors}
              />
            </Group>
          </Canvas>
        </GestureDetector>

        {/* SCORE DU NIVEAU */}
        <LevelViewerStars score={score} isFocused={isFocused} colors={colors} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 72 + 7 + 18 + 16,
  },
  playgroundContainer: {
    width: 72,
    height: 72 + 7,
    borderRadius: 10,
  },
  starsContainer: {
    flex: 1,
    width: 72,
  },
});

export default LevelViewer;
