import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { windowWidth } from "../constants/dimension";
import { Screen } from "../enums/screen.enum";
import Level from "../types/level";
import RootStackParamList from "../types/rootStackParamList.type";
import Icon from "./Icon";

type Props = {
  item: Level[];
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LevelItem = memo(({ item }: Props): JSX.Element => {
  const navigation = useNavigation<levelItemNavigationProp>();

  const navigateToPlayground = (level: Level): void => {
    navigation.navigate(Screen.PLAYGROUND, { level });
  };

  return (
    <View style={{ ...styles.levelItemsContainer }}>
      {item.map((level: Level, index: number) => {
        return (
          <Pressable
            key={index}
            onPress={() => navigateToPlayground(level)}
            style={{ gap: 2, alignItems: "center" }}
          >
            <Icon />
            <Text style={{ color: "white", fontWeight: "700" }}>
              {index + 1}
            </Text>
          </Pressable>
        );
      })}
    </View>
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
