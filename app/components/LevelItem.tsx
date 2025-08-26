import React, { JSX, memo } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Icon from "./Icon";
import { windowWidth } from "../constants/dimension";
import LevelViewer from "./LevelViewer";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../enums/screen.enum";

type Props = {
  item: any;
};

const LevelItem = memo(({ item }: Props): JSX.Element => {
  const navigation = useNavigation();

  const navigateToPlayground = (): void => {
    navigation.navigate(Screen.PLAYGROUND);
  };

  return (
    <Pressable
      onPress={navigateToPlayground}
      style={{ ...styles.levelItemsContainer }}
    >
      {item.map((item: any, index: number) => {
        return (
          <View key={index} style={{ gap: 2, alignItems: "center" }}>
            {/* <LevelViewer level={item.sheme} /> */}

            <Icon />
            <Text style={{ color: "white", fontWeight: "700" }}>
              {index + 1}
            </Text>
          </View>
        );
      })}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  levelItemsContainer: {
    gap: 10,
    width: windowWidth,
    height: "100%",
    paddingHorizontal: 28,
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default LevelItem;
