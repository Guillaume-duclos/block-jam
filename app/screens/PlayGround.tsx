import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, RefObject, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowShapeLeftFill from "../assets/icons/ArrowShapeLeftFill";
import ArrowShapeTurnUpLeft from "../assets/icons/ArrowShapeTurnUpLeft";
import ArrowTriangleHead2ClockwiseRotate90 from "../assets/icons/ArrowTriangleHead2ClockwiseRotate90";
import ArrowTriangleLeft from "../assets/icons/ArrowTriangleLeft";
import ArrowTriangleRight from "../assets/icons/ArrowTriangleRight";
import Settings from "../assets/icons/GearShapeFill";
import SparkleMagnifyingGlass from "../assets/icons/SparkleMagnifyingGlass";
import Button from "../components/Button";
import FixedBlock from "../components/FixedBlock";
import Grid from "../components/Grid";
import MovableBlock from "../components/MovableBlock";
import { playgroundSize } from "../constants/dimension";
import data from "../data/levels.json";
import { BlockType } from "../enums/blockType.enum";
import { Orientation } from "../enums/orientation.enum";
import { Screen } from "../enums/screen.enum";
import useGrid from "../hooks/useGrid.hook";
import ElementData from "../types/elementData.type";
import NavigationProp from "../types/navigation.type";
import RootStackParamList from "../types/rootStackParamList.type";
import { firstLineCaseIndex, lastLineCaseIndex } from "../utils/line";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

export default function PlayGround(): JSX.Element {
  const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);
  const [count, setCount] = useState<number>(0);
  const history: RefObject<[]> = useRef([]);

  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<playGroundRouteProp>();

  // Initialisation des tranches de déplacements possibles
  const grid: number[] = useGrid();

  const difficulty: number = route.params.difficultyIndex;
  const level: number = route.params.level.index;

  useEffect((): void => {
    // console.log(JSON.stringify(vehiclePositions));
  }, [vehiclePositions]);

  useEffect((): void => {
    computeBlockPositions();
  }, []);

  // Initialise les valeurs de vehiclePositions
  const computeBlockPositions = (): void => {
    // On récupère le niveau
    const level: string = route.params?.level.layout;

    // Initialisation du tableau de positions de tous les véhicules
    let positions: ElementData[] = [];

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

  // Mise à jour de la nouvelle position du dernier véhicule déplacé
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
  };

  // Récupère toutes les positions occupées par les véhicules et les blocs fixes
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

  // Retour au menu
  const goback = (): void => {
    navigation.goBack();
  };

  // Ouvre les paramètres
  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  // Réinitialise le niveau
  const reset = (): void => {
    if (history.current.length) {
      computeBlockPositions();
    }

    setCount(0);
  };

  // Annule le dernier mouvement
  const undo = (): void => {
    if (history.current.length) {
      const lastHistory = history.current.at(-1);

      if (lastHistory) {
        history.current.pop();
        updateBlockPosition(lastHistory.previousPosition, lastHistory.label);
      }
    }
  };

  // Rend les véhicules et les blocs
  const renderBlocks = (): JSX.Element[] => {
    return vehiclePositions.map((data: any, vehicleIndex: number) => {
      if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
        return (
          <MovableBlock
            key={`${vehicleIndex}`}
            grid={grid}
            label={data.label}
            range={data.range}
            position={data.position}
            orientation={data.orientation}
            updatePosition={updateBlockPosition}
          />
        );
      } else if (data.label === BlockType.WALL) {
        return data.position.map(
          (position: number, blocIndex: number): JSX.Element => {
            return <FixedBlock position={position} key={`${blocIndex}`} />;
          }
        );
      }
    });
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#D7F3C0", "#D7F3C0"]}>
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={styles.header}>
          <Pressable onPress={goback}>
            <ArrowShapeLeftFill color="#71C146" />
          </Pressable>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerDificulty}>
              Difficulté {difficulty + 1}
            </Text>
            <Text style={styles.headerLevel}>
              Niveau {level + 1} / {data[difficulty].levels.length}
            </Text>
          </View>

          <Pressable onPress={openSettings}>
            <Settings color="#71C146" />
          </Pressable>
        </View>

        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <View style={styles.playgroundContainer}>
          <View style={styles.gridBottomBorder} />

          <View style={styles.gridContainer}>
            <Grid />

            <GestureHandlerRootView style={{}}>
              {grid.length > 0 && vehiclePositions && renderBlocks()}
            </GestureHandlerRootView>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button label="Previous" onPress={reset} style={{ width: 64 - 10 }}>
            <ArrowTriangleLeft style={{ left: -2 }} color="#71C146" />
          </Button>

          <Button label="Reset" onPress={reset} style={{ flex: 1 }}>
            <ArrowTriangleHead2ClockwiseRotate90 color="#71C146" />
          </Button>

          <Button label="Undo" onPress={undo} style={{ flex: 1 }}>
            <ArrowShapeTurnUpLeft color="#71C146" />
          </Button>

          <Button label="Undo" onPress={undo} style={{ flex: 1 }}>
            <SparkleMagnifyingGlass color="#71C146" />
          </Button>

          <Button label="Next" onPress={undo} style={{ width: 64 - 10 }}>
            <ArrowTriangleRight style={{ right: -2 }} color="#71C146" />
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerDificulty: {
    fontSize: 20,
    fontWeight: 800,
    color: "#71C146",
  },
  headerLevel: {
    fontSize: 18,
    fontWeight: 700,
    color: "#71C146",
  },
  countContainer: {
    flex: 1,
    justifyContent: "center",
  },
  count: {
    fontSize: 50,
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
    borderColor: "#F5F7FF",
    backgroundColor: "#B1BDD1",
    // boxShadow: "0 10px 2px 0 #949fb1ff inset",
    boxShadow: "0 0 1px 0.5px #838d9cff inset",
  },
  gridBottomBorder: {
    position: "absolute",
    bottom: -12,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "#CCD0DA",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonsContainer: {
    gap: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#CDCDCD",
  },
});
