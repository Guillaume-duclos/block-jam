import {
  Canvas,
  Group,
  ImageSVG,
  LinearGradient,
  RoundedRect,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { gridCount } from "../config/config";
import { BlockType } from "../enums/blockType.enum";
import { Orientation } from "../enums/orientation.enum";
import useGrid from "../hooks/useGrid.hook";
import { darken } from "../utils/color";

type Props = {
  layout: string;
  style?: ViewStyle;
};

type BlockData = {
  label: string;
  position: number[];
  orientation?: Orientation;
};

export default function LevelViewerTest({ layout, style }: Props): JSX.Element {
  const [vehiclePositions, setVehiclePositions] = useState<BlockData[]>([]);

  // Initialisation des tranches de déplacements possibles
  const grid: number[] = useGrid();

  useEffect((): void => {
    computeBlockPositions();
  }, []);

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

  const playgroundSize = 72;
  const playgroundGridSize = 72 - 8;
  const caseSize = (playgroundGridSize - 6) / 6;
  const gridOffsetX = 4 + 2;
  const gridOffsetY = 4 + 2;
  const gap = 2;
  const cellInner = caseSize - gap;
  const blockRadius = 2;
  const mainColor: string = "#FAF7F2";

  const star = Skia.SVG.MakeFromString(
    `<svg viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.04687 17.1328C3.82812 16.9661 3.69531 16.7474 3.64843 16.4766C3.60156 16.2057 3.63802 15.8958 3.75781 15.5469L5.3125 10.9219L1.34375 8.07031C1.04166 7.85677 0.828121 7.6276 0.703121 7.38281C0.578121 7.13281 0.562496 6.875 0.656246 6.60938C0.744787 6.34896 0.90885 6.15625 1.14843 6.03125C1.39322 5.90104 1.69791 5.83854 2.0625 5.84375L6.9375 5.88281L8.42187 1.22656C8.53645 0.867188 8.6901 0.59375 8.88281 0.40625C9.08072 0.213542 9.3177 0.117188 9.59375 0.117188C9.86979 0.117188 10.1042 0.213542 10.2969 0.40625C10.4948 0.59375 10.651 0.867188 10.7656 1.22656L12.2422 5.88281L17.1172 5.84375C17.487 5.83854 17.7917 5.90104 18.0312 6.03125C18.276 6.15625 18.4427 6.35156 18.5312 6.61719C18.6198 6.88281 18.6016 7.13802 18.4766 7.38281C18.3568 7.6276 18.1458 7.85677 17.8437 8.07031L13.8672 10.9219L15.4297 15.5469C15.5495 15.8958 15.5859 16.2057 15.5391 16.4766C15.4922 16.7474 15.3568 16.9661 15.1328 17.1328C14.9088 17.3047 14.6615 17.3672 14.3906 17.3203C14.1198 17.2786 13.8333 17.1484 13.5312 16.9297L9.59375 14.0312L5.64843 16.9297C5.35156 17.1484 5.0651 17.2786 4.78906 17.3203C4.51822 17.3672 4.27083 17.3047 4.04687 17.1328ZM5.85937 14.6484C5.86458 14.6589 5.88281 14.6536 5.91406 14.6328L9.02343 12.1875C9.24218 12.0208 9.43229 11.9375 9.59375 11.9375C9.7552 11.9375 9.94531 12.0208 10.1641 12.1875L13.2734 14.6328C13.2995 14.6536 13.3177 14.6589 13.3281 14.6484C13.3385 14.638 13.3385 14.6172 13.3281 14.5859L11.9687 10.875C11.9062 10.7083 11.8724 10.5651 11.8672 10.4453C11.862 10.3255 11.8932 10.2188 11.9609 10.125C12.0286 10.026 12.1432 9.92188 12.3047 9.8125L15.5859 7.60156C15.6172 7.58594 15.6302 7.57031 15.625 7.55469C15.6198 7.53906 15.599 7.53125 15.5625 7.53125L11.6172 7.67188C11.3411 7.67708 11.138 7.63802 11.0078 7.55469C10.8776 7.46615 10.776 7.28906 10.7031 7.02344L9.625 3.22656C9.61979 3.19531 9.60937 3.17969 9.59375 3.17969C9.57812 3.17969 9.5651 3.19531 9.55468 3.22656L8.47656 7.02344C8.40885 7.28906 8.30989 7.46615 8.17968 7.55469C8.04947 7.63802 7.84635 7.67708 7.57031 7.67188L3.625 7.53125C3.58854 7.53125 3.5677 7.53906 3.5625 7.55469C3.55729 7.57031 3.57031 7.58594 3.60156 7.60156L6.88281 9.8125C7.04427 9.91667 7.15885 10.0182 7.22656 10.1172C7.29427 10.2161 7.32291 10.3255 7.3125 10.4453C7.30729 10.5651 7.27343 10.7083 7.21093 10.875L5.85156 14.5859C5.84635 14.6172 5.84895 14.638 5.85937 14.6484Z" fill="#FFFFFF"/>
      </svg>`
  );

  const starSemiFill = Skia.SVG.MakeFromString(
    `<svg viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.04687 17.1328C3.82812 16.9661 3.69531 16.7474 3.64843 16.4766C3.60156 16.2057 3.63802 15.8958 3.75781 15.5469L5.3125 10.9219L1.34375 8.07031C1.04166 7.85677 0.828121 7.6276 0.703121 7.38281C0.578121 7.13281 0.562496 6.875 0.656246 6.60938C0.744787 6.34896 0.90885 6.15625 1.14843 6.03125C1.39322 5.90104 1.69791 5.83854 2.0625 5.84375L6.9375 5.88281L8.42187 1.22656C8.53645 0.867188 8.6901 0.59375 8.88281 0.40625C9.08072 0.213542 9.3177 0.117188 9.59375 0.117188C9.86979 0.117188 10.1042 0.213542 10.2969 0.40625C10.4948 0.59375 10.651 0.867188 10.7656 1.22656L12.2422 5.88281L17.1172 5.84375C17.487 5.83854 17.7917 5.90104 18.0312 6.03125C18.276 6.15625 18.4427 6.35156 18.5312 6.61719C18.6198 6.88281 18.6016 7.13802 18.4766 7.38281C18.3568 7.6276 18.1458 7.85677 17.8437 8.07031L13.8672 10.9219L15.4297 15.5469C15.5495 15.8958 15.5859 16.2057 15.5391 16.4766C15.4922 16.7474 15.3568 16.9661 15.1328 17.1328C14.9088 17.3047 14.6615 17.3672 14.3906 17.3203C14.1198 17.2786 13.8333 17.1484 13.5312 16.9297L9.59375 14.0312L5.64843 16.9297C5.35156 17.1484 5.0651 17.2786 4.78906 17.3203C4.51822 17.3672 4.27083 17.3047 4.04687 17.1328ZM9.59375 11.9375C9.75 11.9323 9.9401 12.0156 10.1641 12.1875L13.2734 14.6328C13.2995 14.6536 13.3177 14.6589 13.3281 14.6484C13.3385 14.638 13.3385 14.6172 13.3281 14.5859L11.9687 10.875C11.9062 10.7083 11.8724 10.5651 11.8672 10.4453C11.862 10.3255 11.8932 10.2188 11.9609 10.125C12.0286 10.026 12.1432 9.92188 12.3047 9.8125L15.5859 7.60156C15.6172 7.58594 15.6302 7.57031 15.625 7.55469C15.6198 7.53906 15.599 7.53125 15.5625 7.53125L11.6172 7.67188C11.3411 7.67708 11.138 7.63802 11.0078 7.55469C10.8776 7.46615 10.776 7.28906 10.7031 7.02344L9.625 3.22656C9.61979 3.19531 9.60937 3.17969 9.59375 3.17969V11.9375Z" fill="#FFFFFF"/>
      </svg>`
  );

  const starFill = Skia.SVG.MakeFromString(
    `<svg viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.04687 17.1328C3.82812 16.9661 3.69531 16.7474 3.64843 16.4766C3.60156 16.2057 3.63802 15.8958 3.75781 15.5469L5.3125 10.9219L1.34375 8.07031C1.04166 7.85677 0.828121 7.6276 0.703121 7.38281C0.578121 7.13281 0.562496 6.875 0.656246 6.60938C0.744787 6.34896 0.90885 6.15625 1.14843 6.03125C1.39322 5.90625 1.69791 5.84375 2.0625 5.84375H6.9375L8.42187 1.22656C8.53645 0.867188 8.6901 0.59375 8.88281 0.40625C9.08072 0.213542 9.3177 0.117188 9.59375 0.117188C9.86979 0.117188 10.1042 0.213542 10.2969 0.40625C10.4948 0.59375 10.651 0.867188 10.7656 1.22656L12.2422 5.84375H17.1172C17.487 5.84375 17.7917 5.90625 18.0312 6.03125C18.276 6.15625 18.4427 6.35156 18.5312 6.61719C18.6198 6.88281 18.6016 7.13802 18.4766 7.38281C18.3568 7.6276 18.1458 7.85677 17.8437 8.07031L13.8672 10.9219L15.4297 15.5469C15.5495 15.8958 15.5859 16.2057 15.5391 16.4766C15.4922 16.7474 15.3568 16.9661 15.1328 17.1328C14.9088 17.3047 14.6615 17.3672 14.3906 17.3203C14.1198 17.2786 13.8333 17.1484 13.5312 16.9297L9.59375 14.0312L5.64843 16.9297C5.35156 17.1484 5.0651 17.2786 4.78906 17.3203C4.51822 17.3672 4.27083 17.3047 4.04687 17.1328Z" fill="#FFFFFF"/>
      </svg>`
  );

  // Rend les véhicules et les blocs
  const renderBlocks = (): JSX.Element[] => {
    return vehiclePositions.flatMap((data: BlockData, vehicleIndex: number) => {
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
          data.label === BlockType.MAIN_BLOCK ? "#DA6C6C" : "#F5F7FF";
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

          const mainBlockColor = "#939EB0";
          const secondBlockColor = darken("#939EB0", 0.08);

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
                {/* <Group
                  transform={[{ translateX: x + 2 }, { translateY: y + 2 }]}
                >
                  <RoundedRect
                    x={5}
                    y={5}
                    r={10}
                    width={cellInner * 0.14}
                    height={cellInner * 0.14}
                    color={darken("#939EB0", 0.25)}
                  />
                  <RoundedRect
                    x={cellInner - cellInner * 0.14 - 5}
                    y={5}
                    r={10}
                    width={cellInner * 0.14}
                    height={cellInner * 0.14}
                    color={darken("#939EB0", 0.25)}
                  />
                  <RoundedRect
                    x={cellInner - cellInner * 0.14 - 5}
                    y={cellInner - cellInner * 0.14 - 9}
                    r={10}
                    width={cellInner * 0.14}
                    height={cellInner * 0.14}
                    color={darken("#939EB0", 0.25)}
                  />
                  <RoundedRect
                    x={5}
                    y={cellInner - cellInner * 0.14 - 9}
                    r={10}
                    width={cellInner * 0.14}
                    height={cellInner * 0.14}
                    color={darken("#939EB0", 0.25)}
                  />
                </Group> */}
              </RoundedRect>
            </RoundedRect>
          );
        });
      }
    });
  };

  return (
    <Canvas style={styles.playgroundContainer}>
      <RoundedRect
        x={0}
        y={5}
        r={10}
        width={playgroundSize}
        height={playgroundSize}
        color={darken(mainColor, 0.16)}
      />

      <RoundedRect
        x={0}
        y={0}
        r={10}
        width={playgroundSize}
        height={playgroundSize}
        color={darken(mainColor, 0.1)}
      >
        <RoundedRect
          x={4}
          y={4}
          r={6}
          width={playgroundGridSize}
          height={playgroundGridSize}
          color={darken("#D6F5BC", 0.2)}
        />

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
                color={darken("#D6F5BC", 0.3)}
              />
            );
          })}
        </Group>
      </RoundedRect>

      {renderBlocks()}

      <Group transform={[{ translateX: 8.5 }, { translateY: 72 + 8 }]}>
        <ImageSVG svg={starFill} x={0} y={0} width={16} height={16} />
        <ImageSVG svg={starSemiFill} x={19} y={0} width={16} height={16} />
        <ImageSVG svg={star} x={38} y={0} width={16} height={16} />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  playgroundContainer: {
    width: 72,
    height: 72 + 8 + 16,
  },
});
