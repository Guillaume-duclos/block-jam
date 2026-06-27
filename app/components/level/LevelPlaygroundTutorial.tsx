import { useFocusEffect } from "@react-navigation/native";
import { ImpactFeedbackStyle } from "expo-haptics";
import React, {
  JSX,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { goalCaseIndex, gridCount } from "../../config/config";
import { caseSize, playgroundSize } from "../../constants/dimension";
import {
  finalGridPosition,
  tutorialFirstBlocFinalGridPosition,
  tutorialSecondBlocFinalGridPosition,
} from "../../constants/positions";
import { BlockType } from "../../enums/blockType.enum";
import { Direction } from "../../enums/direction";
import { Orientation } from "../../enums/orientation.enum";
import { StorageKey } from "../../enums/storageKey.enum";
import useGrid from "../../hooks/useGrid.hook";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import ElementData from "../../types/elementData.type";
import { Level } from "../../types/level.type";
import Score from "../../types/score.type";
import { darken } from "../../utils/color";
import { firstLineCaseIndex, lastLineCaseIndex } from "../../utils/line";
import {
  getStorageBoolean,
  getStorageString,
  setStorageObject,
} from "../../utils/storage";
import FixedBlock from "../block/FixedBlock";
import MovableBlock from "../block/MovableBlock";
import LevelGrid from "./LevelGrid";

type Props = {
  level: Partial<Level>;
  levelIndex: number;
  difficultyIndex: number;
  onStepChange?: (step: number) => void;
  style?: ViewStyle;
};

const LevelPlaygroundTutorial = memo(
  ({
    level,
    levelIndex,
    difficultyIndex,
    onStepChange,
    style,
  }: Props): JSX.Element | undefined => {
    const grid: number[] = useGrid();
    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;
    const frameColor = dificultyTheme?.frame!;

    const addNewScore = useLevelStore((value) => value.addNewScore);
    const incrementCount = useLevelStore((value) => value.incrementCount);
    const resetLevelData = useLevelStore((value) => value.resetLevelData);

    const [hapticEnable, setHapticEnable] = useState<boolean>(false);
    const [hapticStyle, setHapticStyle] = useState<ImpactFeedbackStyle>(
      ImpactFeedbackStyle.Medium,
    );
    const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);
    const [step, setStep] = useState(0);

    const isAnimatabled = useRef<boolean>(true);
    const levelVersion = useRef<number>(0);

    useFocusEffect(
      useCallback(() => {
        const hapticEnable = getStorageBoolean(
          StorageKey.ALLOW_DRAG_HAPTIC_FEEDBACK,
        );

        setHapticEnable(hapticEnable ?? true);

        const storedIntensity = getStorageString(
          StorageKey.DRAG_HAPTIC_FEEDBACK_INTENSITY,
        );

        const intensityIndex =
          storedIntensity !== null ? Number(storedIntensity) : 0;

        const styles = [
          ImpactFeedbackStyle.Light,
          ImpactFeedbackStyle.Medium,
          ImpactFeedbackStyle.Heavy,
        ];

        setHapticStyle(styles[intensityIndex] ?? ImpactFeedbackStyle.Light);
      }, []),
    );

    useEffect((): (() => void) => {
      resetLevelData();

      if (isAnimatabled.current) {
        const id = requestIdleCallback(() => {
          computeBlockPositions();
        });

        return () => {
          cancelIdleCallback(id);
          isAnimatabled.current = false;
        };
      } else {
        computeBlockPositions();
        return () => {};
      }
    }, [level]);

    useEffect(() => {
      if (isAnimatabled.current && vehiclePositions.length > 0) {
        isAnimatabled.current = false;
      }
    }, [vehiclePositions]);

    // Initialise les valeurs de vehiclePositions
    const computeBlockPositions = (): void => {
      const scheme: string = level?.scheme!;
      const positions: ElementData[] = [];
      const labelIndexMap = new Map<string, number>();

      for (let i = 0; i < scheme.length; i++) {
        const label = scheme.charAt(i);
        const existingIndex = labelIndexMap.get(label);

        if (existingIndex !== undefined) {
          positions[existingIndex].position.push(i);
          continue;
        }

        labelIndexMap.set(label, positions.length);

        if (label === BlockType.EMPTY || label === BlockType.WALL) {
          positions.push({ label, position: [i] });
        } else {
          const orientation =
            scheme[i + 1] === label
              ? Orientation.HORIZONTAL
              : Orientation.VERTICAL;
          positions.push({ label, range: [], position: [i], orientation });
        }
      }

      const occupiedSet = computesOccupiedPositions(positions);

      const positionsWithRanges = positions.map((position) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedSet),
          };
        }
        return position;
      });

      levelVersion.current += 1;
      setVehiclePositions(positionsWithRanges);
    };

    // Mise à jour de la nouvelle position du dernier bloc déplacé
    const updateBlockPosition = (
      label: string,
      position: number[],
      addToHistory?: boolean,
    ): void => {
      const index = vehiclePositions.findIndex((p) => p.label === label);

      // Crée un nouveau tableau sans muter le state
      const withUpdatedPosition = vehiclePositions.map((p, i) =>
        i === index ? { ...p, position } : p,
      );

      const occupiedSet = computesOccupiedPositions(withUpdatedPosition);

      const newPositions = withUpdatedPosition.map((p: ElementData) => {
        if (p.label !== BlockType.WALL && p.label !== BlockType.EMPTY) {
          return { ...p, range: computeBlockRange(p, occupiedSet) };
        }
        return p;
      });

      setVehiclePositions(newPositions);

      const firstBloc = newPositions.find(
        (p) => p.label === BlockType.TUTORIAL_FIRST_BLOC,
      );
      const secondBloc = newPositions.find(
        (p) => p.label === BlockType.TUTORIAL_SECOND_BLOC,
      );
      const mainBloc = newPositions.find(
        (p) => p.label === BlockType.MAIN_BLOCK,
      );

      let newStep = 0;
      if (mainBloc?.position[1] === finalGridPosition) newStep = 3;
      else if (
        firstBloc?.position[0] === tutorialFirstBlocFinalGridPosition &&
        secondBloc?.position[0] === tutorialSecondBlocFinalGridPosition
      )
        newStep = 2;
      else if (firstBloc?.position[0] === tutorialFirstBlocFinalGridPosition)
        newStep = 1;

      setStep(newStep);
      onStepChange?.(newStep);

      // N'incrémente le compteur que pour les vrais mouvements, pas les undos
      if (addToHistory) {
        incrementCount();
      }

      if (label === BlockType.MAIN_BLOCK && position[1] === 17) {
        saveLevelScore();
      }
    };

    // Récupère toutes les positions occupées par les blocs
    const computesOccupiedPositions = (
      positions: ElementData[],
    ): Set<number> => {
      const set = new Set<number>();
      for (const p of positions) {
        if (p.label !== BlockType.EMPTY) {
          for (const pos of p.position) {
            set.add(pos);
          }
        }
      }
      return set;
    };

    // Calcule de la plage de valeur de déplacement possible
    const computeBlockRange = (
      element: ElementData,
      occupiedSet: Set<number>,
    ): number[] => {
      let min = firstLineCaseIndex(element.position, element.orientation);
      let max = lastLineCaseIndex(element.position, element.orientation);

      const lineCases: number[] = [];

      if (element.orientation === Orientation.HORIZONTAL) {
        for (let i = min; i <= max; i++) {
          lineCases.push(i);
        }
      } else {
        for (let i = min; i <= max; i += 6) {
          lineCases.push(i);
        }
      }

      const emptyCases: number[] = lineCases.filter(
        (value) => !occupiedSet.has(value),
      );

      let minPosition = element.position[0];
      let maxPosition = element.position[element.position.length - 1];

      const offset = element.orientation === Orientation.HORIZONTAL ? 1 : 6;

      while (emptyCases.includes(minPosition - offset)) {
        minPosition -= offset;
      }

      while (emptyCases.includes(maxPosition + offset)) {
        maxPosition += offset;
      }

      min = lineCases.indexOf(minPosition);
      max = lineCases.indexOf(maxPosition);

      return [min, max];
    };

    // Sauvegarde le score du niveau joué
    const saveLevelScore = (): void => {
      const count = useLevelStore.getState().count;
      const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

      let levelScores: Score[] = [];

      try {
        levelScores = savedLevelScores ? JSON.parse(savedLevelScores) : [];
      } catch (_) {
        levelScores = [];
      }

      const ratio = level.minimumMoves! / count;

      const newLevelScore: Score = {
        difficulty: difficultyIndex,
        level: levelIndex,
        count: count,
        score: ratio,
      };

      const existingIndex = levelScores.findIndex(
        (score) =>
          score.difficulty === difficultyIndex && score.level === levelIndex,
      );

      if (existingIndex !== -1) {
        const previousScore = levelScores[existingIndex].score;

        if (previousScore < ratio) {
          levelScores[existingIndex] = newLevelScore;
        } else {
          return;
        }
      } else {
        levelScores.push(newLevelScore);
      }

      addNewScore(newLevelScore);
      setStorageObject(StorageKey.LEVEL_SCORE, levelScores);
    };

    const stepConfig = [
      { label: BlockType.TUTORIAL_FIRST_BLOC, direction: Direction.LEFT },
      { label: BlockType.TUTORIAL_SECOND_BLOC, direction: Direction.DOWN },
      { label: BlockType.MAIN_BLOCK, direction: Direction.RIGHT },
    ];

    const currentStepConfig = stepConfig[step];

    // Rend les blocs
    const renderBlocks = (): JSX.Element[] => {
      return vehiclePositions.map((data: any, vehicleIndex: number) => {
        if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
          const col = data.position[0] % gridCount;
          const row = Math.floor(data.position[0] / gridCount);
          const arrowDirection =
            data.label === currentStepConfig?.label
              ? currentStepConfig.direction
              : undefined;

          return (
            <MovableBlock
              key={`${levelVersion.current}-${data.label}`}
              index={vehicleIndex}
              label={data.label}
              range={data.range}
              position={data.position}
              orientation={data.orientation}
              initialX={col * caseSize}
              initialY={row * caseSize}
              hapticEnable={hapticEnable}
              hapticStyle={hapticStyle}
              animatabled={isAnimatabled.current}
              updatePosition={updateBlockPosition}
              arrowDirection={arrowDirection}
            />
          );
        } else if (data.label === BlockType.WALL) {
          return data.position.map(
            (position: number, blocIndex: number): JSX.Element => {
              const col = position % gridCount;
              const row = Math.floor(position / gridCount);

              return (
                <FixedBlock
                  key={`${levelVersion.current}-${data.label}-${blocIndex}`}
                  index={vehicleIndex}
                  position={position}
                  initialX={col * caseSize}
                  initialY={row * caseSize}
                  animatabled={isAnimatabled.current}
                />
              );
            },
          );
        }
      });
    };

    return (
      <View style={{ ...styles.container, ...style }}>
        <View
          style={{
            ...styles.playgroundContainer,
            boxShadow: `0 20px 16px 0 ${darken(mainColor, 0.3)}`,
          }}
        >
          <View
            style={{
              ...styles.gridBottomBorder,
              backgroundColor: darken(frameColor, 0.16),
            }}
          />

          <View
            style={{
              ...styles.gridContainer,
              borderColor: frameColor,
              backgroundColor: darken(mainColor, 0),
              boxShadow: `0 0 1px 0.5px ${darken(mainColor, 0.35)} inset`,
            }}
          >
            <LevelGrid
              color={mainColor}
              showGoalArrow={
                level.scheme?.[goalCaseIndex] !== BlockType.EMPTY &&
                level.scheme?.[goalCaseIndex] !== BlockType.WALL
              }
            />

            <GestureHandlerRootView>
              {grid.length > 0 && vehiclePositions && renderBlocks()}
            </GestureHandlerRootView>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  playgroundContainer: {
    width: playgroundSize,
    height: playgroundSize,
    borderRadius: 20,
    marginBottom: 12,
  },
  gridContainer: {
    width: playgroundSize,
    height: playgroundSize,
    padding: 10,
    paddingTop: 10,
    borderWidth: 10,
    borderRadius: 20,
  },
  gridBottomBorder: {
    position: "absolute",
    bottom: -12,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default LevelPlaygroundTutorial;
