import React, {
  JSX,
  memo,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { playgroundSize, windowWidth } from "../constants/dimension";
import { BlockType } from "../enums/blockType.enum";
import { Orientation } from "../enums/orientation.enum";
import useGrid from "../hooks/useGrid.hook";
import { useLevelStore } from "../store/level";
import ElementData from "../types/elementData.type";
import { Level } from "../types/level.type";
import { darken } from "../utils/color";
import { firstLineCaseIndex, lastLineCaseIndex } from "../utils/line";
import FixedBlock from "./FixedBlock";
import Grid from "./Grid";
import MovableBlock from "./MovableBlock";

type Props = {
  ref: RefObject<LevelPlaygroundRef | null>;
  level: Partial<Level>;
  onLevelFinish: (count: number) => void;
};

export type LevelPlaygroundRef = {
  reset: () => void;
  undo: () => void;
};

const LevelPlayground = memo(
  ({ ref, level, onLevelFinish }: Props): JSX.Element => {
    const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);
    const [count, setCount] = useState<number>(0);
    const history: RefObject<[]> = useRef([]);

    // Initialisation des tranches de déplacements possibles
    const grid: number[] = useGrid();

    const setCurrentCount = useLevelStore((value) => value.setCurrentCount);
    const setIsUndoEnabled = useLevelStore((value) => value.setIsUndoEnabled);

    const mainColor: string = "#FAF7F2";

    useImperativeHandle(ref, () => ({
      reset() {
        if (history.current.length) {
          computeBlockPositions();
        }

        console.log("reset");

        setCount(0);
      },

      undo() {
        if (history.current.length) {
          const lastHistory = history.current.at(-1);

          if (lastHistory) {
            history.current.pop();
            updateBlockPosition(
              lastHistory.previousPosition,
              lastHistory.label
            );
          }
        }
      },
    }));

    useEffect((): void => {
      // console.log({ count });

      if (count === 0) {
        setIsUndoEnabled(false);
        history.current = [];
      } else {
        const disabledUndo = history.current.at(-1) === undefined;
        setIsUndoEnabled(!disabledUndo);
      }

      // setCurrentCount(count);
    }, [count]);

    useEffect((): void => {
      computeBlockPositions();
    }, []);

    // Initialise les valeurs de vehiclePositions
    const computeBlockPositions = (): void => {
      // On récupère le niveau
      const layout: string = level?.layout;

      // Initialisation du tableau de positions de tous les véhicules
      let positions: ElementData[] = [];

      // On parse toutes les lettres de la description de la grille
      for (let i: number = 0; i < layout.length; i++) {
        // 1. On récupère le label
        const label: string = layout.charAt(i);

        // 2. On vérifie si le label n'a pas déjà été inséré
        const previousSameLabel: number = positions.findIndex(
          (position): boolean => position.label === label
        );

        // 3. On récupère l'orientation
        let orientation: Orientation = Orientation.NULL;

        if (previousSameLabel === -1) {
          if (layout[i + 1] === label) {
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
            range: [],
            position: [i],
            orientation,
          });
        }
      }

      // 5. On récupère toutes les positions occupées
      const occupiedPositions = computesOccupiedPositions(positions);

      // 6. On récupère les plages de valeur min et max
      positions = positions.map((position) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedPositions),
          };
        }

        return { ...position };
      });

      setVehiclePositions(positions);
    };

    // Mise à jour de la nouvelle position du dernier bloc déplacé
    const updateBlockPosition = (
      position: number[],
      label: string,
      addToHistory?: boolean
    ): void => {
      // On récupère l'index du véhicule dans le tableau des positions avec le label
      const index = vehiclePositions.findIndex(
        (position) => position.label === label
      );

      // On ajoute la nouvelle position dans l'historique si l'option est activé
      if (addToHistory) {
        const newHistoricPositions = {
          previousPosition: vehiclePositions[index].position,
          label,
        };

        history.current.push(newHistoricPositions);
      }

      // On récupère toutes les positions
      let newPositions = vehiclePositions;

      // On ajoute les nouvelles valeurs du véhicule
      newPositions[index].position = position;

      // On met à jour la valeur du range des autres véhicules
      const occupiedPositions = computesOccupiedPositions(newPositions);

      // On récupère les plages de valeur min et max
      newPositions = vehiclePositions.map((position: ElementData) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedPositions),
          };
        }

        return { ...position };
      });

      // On met à jour la tableau des positions et le compteur de mouvement
      setVehiclePositions(newPositions);
      setCount(count + 1);

      // On vérifie si le bloc est le bloc principale et si il est sur la case gagnante
      if (label === BlockType.MAIN_BLOCK && position[1] === 17) {
        onLevelFinish(count + 1);
      }
    };

    // Récupère toutes les positions occupées par les blocs
    const computesOccupiedPositions = (positions: ElementData[]): number[] => {
      const occupiedPositions: number[] = [];

      for (let i: number = 0; i < positions.length; i++) {
        if (positions[i].label !== BlockType.EMPTY) {
          for (let y: number = 0; y < positions[i].position.length; y++) {
            occupiedPositions.push(positions[i].position[y]);
          }
        }
      }

      return occupiedPositions;
    };

    // Calcule de la plage de valeur de déplacement possible
    const computeBlockRange = (
      element: ElementData,
      occupiedPositions: number[]
    ): number[] => {
      // On récupère la plage de valeur minimum et maximum du véhicule
      let min = firstLineCaseIndex(element.position, element.orientation);
      let max = lastLineCaseIndex(element.position, element.orientation);

      // On calcule les positions minimum et maximum pour le véhicule
      const lineCases: number[] = [];

      // 1. On récupère toutes les cases de la ligne
      if (element.orientation === Orientation.HORIZONTAL) {
        for (let i: number = min; i <= max; i++) {
          lineCases.push(i);
        }
      } else {
        for (let i: number = min; i <= max; i += 6) {
          lineCases.push(i);
        }
      }

      // 2. On récupère les cases libres dans la ligne
      const emptyCases: number[] = lineCases.filter(
        (value: number) => !occupiedPositions.includes(value)
      );

      // 3. On récupère les positions minimum et maximum disponibles
      let minPosition: number = element.position[0];
      let maxPosition: number = element.position[element.position.length - 1];

      const offset = element.orientation === Orientation.HORIZONTAL ? 1 : 6;

      // On récupère la position minimum
      while (emptyCases.includes(minPosition - offset)) {
        minPosition -= offset;
      }

      // On récupère la position maximum
      while (emptyCases.includes(maxPosition + offset)) {
        maxPosition += offset;
      }

      // 4. On convertit les positions minimale et maximale au format correspondant
      min = lineCases.indexOf(minPosition);
      max = lineCases.indexOf(maxPosition);

      return [min, max];
    };

    // Rend les blocs
    const renderBlocks = (): JSX.Element[] => {
      return vehiclePositions.map((data: any, vehicleIndex: number) => {
        if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
          return (
            <MovableBlock
              key={`${vehicleIndex}`}
              index={vehicleIndex}
              grid={grid}
              label={data.label}
              range={data.range}
              position={data.position}
              orientation={data.orientation}
              color="#F5F7FF"
              updatePosition={updateBlockPosition}
            />
          );
        } else if (data.label === BlockType.WALL) {
          return data.position.map(
            (position: number, blocIndex: number): JSX.Element => {
              return (
                <FixedBlock
                  index={vehicleIndex}
                  position={position}
                  key={`${blocIndex}`}
                  color="#939EB0"
                />
              );
            }
          );
        }
      });
    };

    return (
      <View style={styles.container}>
        {/* SCORES */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoresSubContainer}>
            {/* CURRENT COUNT */}
            <View style={{ ...styles.scoreContainer }}>
              <Text style={styles.scoreTitle}>Coups</Text>

              <View style={{ borderWidth: 0 }}>
                <Text
                  style={styles.count}
                  // adjustsFontSizeToFit
                  // minimumFontScale={0.5}
                  // numberOfLines={1}
                >
                  {count}
                </Text>
              </View>
            </View>

            {/* PREVIOUS SCORES */}
            <View
              style={{
                ...styles.scoreContainer,
                ...styles.previousScoreContainer,
              }}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={2}
                minimumFontScale={0.5}
                style={styles.scoreTitle}
              >
                Scores précédents
              </Text>

              <View style={styles.previousScoreLabelContainer}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.previousScoreLabel}
                >
                  Coups : 34
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.previousScoreLabel}
                >
                  Temps : 2:03
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PLAYGROUND */}
        <View style={styles.playgroundContainer}>
          <View
            style={{
              ...styles.gridBottomBorder,
              backgroundColor: darken(mainColor, 0.16),
            }}
          />

          <View
            style={{
              ...styles.gridContainer,
              borderColor: mainColor,
              backgroundColor: darken("#D6F5BC", 0.2),
              boxShadow: `0 0 1px 0.5px ${darken("#D6F5BC", 0.35)} inset`,
            }}
          >
            <Grid color="#D6F5BC" />

            <GestureHandlerRootView>
              {grid.length > 0 && vehiclePositions && renderBlocks()}
            </GestureHandlerRootView>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    alignItems: "center",
  },
  scoresContainer: {
    flex: 1,
    justifyContent: "center",
  },
  scoresSubContainer: {
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    borderWidth: 0,
  },
  scoreContainer: {
    width: "48%",
    justifyContent: "space-between",
    borderWidth: 0,
  },
  previousScoreContainer: {
    gap: 6,
    justifyContent: "space-between",
  },
  scoreTitle: {
    fontSize: 30,
    fontWeight: 700,
    textTransform: "uppercase",
    fontFamily: "Rubik",
    color: darken("#D6F5BC", 0.25),
    borderWidth: 0,
  },
  count: {
    height: 110,
    fontSize: 120,
    fontWeight: 600,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: darken("#D6F5BC", 0.3),
    marginBottom: 1,
    borderWidth: 0,
    borderColor: "red",
    lineHeight: 134,
  },
  previousScoreLabelContainer: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: darken("#D6F5BC", 0.3),
    borderWidth: 0,
  },
  previousScoreLabel: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: darken("#D6F5BC", 0.3),
    borderWidth: 0,
  },
  playgroundContainer: {
    width: playgroundSize,
    height: playgroundSize,
    boxShadow: "0 20px 16px 0 #00000050",
    borderRadius: 20,
    marginBottom: 50,
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

export default LevelPlayground;
