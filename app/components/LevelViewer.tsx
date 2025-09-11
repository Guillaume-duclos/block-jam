import { Canvas, RoundedRect } from "@shopify/react-native-skia";
import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { gridCount } from "../config/config";
import { BlockType } from "../enums/blockType.enum";
import { Orientation } from "../enums/orientation.enum";
import useGrid from "../hooks/useGrid.hook";

type Props = {
  layout: string;
  style?: ViewStyle;
};

type BlockData = {
  label: string;
  position: number[];
  orientation?: Orientation;
};

export default function LevelViewer({ layout, style }: Props): JSX.Element {
  const [vehiclePositions, setVehiclePositions] = useState<BlockData[]>([]);

  // Initialisation des tranches de déplacements possibles
  const grid: number[] = useGrid();

  useEffect((): void => {
    computeBlockPositions();
  }, []);

  useEffect((): void => {
    // console.log(vehiclePositions);
  }, [vehiclePositions]);

  // Initialise les valeurs de vehiclePositions
  const computeBlockPositions = (): void => {
    // On récupère le niveau
    const level: string = layout;

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

  // Rend les véhicules et les blocs
  const renderBlocks = (): JSX.Element[] => {
    return vehiclePositions.map((data: BlockData, vehicleIndex: number) => {
      const unit = (72 - 8 - 8) / 6;

      if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
        const x =
          (data.position[0] -
            gridCount * Math.floor(data.position[0] / gridCount)) *
            unit +
          6 +
          1 *
            (data.position[0] -
              gridCount * Math.floor(data.position[0] / gridCount));

        const y =
          Math.floor(data.position[0] / gridCount) * unit +
          6 +
          1 * Math.floor(data.position[0] / gridCount);

        const width =
          data.orientation === Orientation.HORIZONTAL
            ? data.position.length * unit
            : unit;

        const heigth =
          data.orientation === Orientation.HORIZONTAL
            ? unit
            : data.position.length * unit;

        return (
          <RoundedRect
            key={vehicleIndex}
            x={x}
            y={y}
            r={2}
            width={width}
            height={heigth}
            color={data.label === BlockType.MAIN_BLOCK ? "#FEBAAF" : "#F5F7FF"}
          />
        );
      } else if (data.label === BlockType.WALL) {
        return data.position.map(
          (position: number, blocIndex: number): JSX.Element => {
            const x: number =
              (position - gridCount * Math.floor(position / gridCount)) * unit +
              6 +
              1 * (position - gridCount * Math.floor(position / gridCount));

            const y: number =
              Math.floor(position / gridCount) * unit +
              6 +
              1 * Math.floor(position / gridCount);

            return (
              <RoundedRect
                key={blocIndex}
                x={x}
                y={y}
                r={2}
                width={unit}
                height={unit}
                color="#6f7785ff"
              />
            );
          }
        );
      }
    });
  };

  return (
    <Canvas style={styles.playgroundContainer}>
      <RoundedRect x={0} y={4} r={12} width={72} height={72} color="#CCD0DA" />

      <RoundedRect x={0} y={0} r={12} width={72} height={72} color="#F5F7FF">
        <RoundedRect
          x={4}
          y={4}
          r={8}
          width={72 - 8}
          height={72 - 8}
          color="#B1BDD1"
        />

        {renderBlocks()}
      </RoundedRect>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  playgroundContainer: {
    width: 72,
    height: 72 + 4,
    //boxShadow: "0 10px 10px 0 #00000050",
    borderRadius: 12,
  },
  gridContainer: {
    width: 72,
    height: 72 + 10,
    padding: 10,
    paddingTop: 18,
    borderWidth: 10,
    borderRadius: 20,
    borderColor: "#F5F7FF",
    backgroundColor: "#B1BDD1",
    boxShadow: "0 10px 2px 0 #949fb1ff inset",
  },
  gridBottomBorder: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "#CCD0DA",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
