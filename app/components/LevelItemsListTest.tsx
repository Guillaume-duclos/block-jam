import React, { JSX, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { windowHeight, windowWidth } from '@/app/constants/dimension';
import ScrollInsetPosition from '@/app/enums/scrollInsetPosition.enum';
import PaginationIndicator from '@/app/components/PaginationIndicator';
import ScrollInset from '@/app/components/ScrollInset';
import LevelItem from '@/app/components/LevelItem';
import { FlashList } from '@shopify/flash-list';

interface Props {
  level: any;
}

export default function LevelItemsListTest({ level }: Props): JSX.Element {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const levelItemsConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
    setActiveViewIndex(viewableItems[0]?.index);
  }).current;

  return (
    <View style={styles.container}>
      <FlashList
        data={level.levels}
        horizontal
        pagingEnabled
        estimatedItemSize={windowWidth * 10}
        contentContainerStyle={{ backgroundColor: level.color }}
        ListHeaderComponent={() => (
          <ScrollInset
            color={level.color}
            position={ScrollInsetPosition.LEFT}
          />
        )}
        ListFooterComponent={() => (
          <ScrollInset
            color={level.color}
            position={ScrollInsetPosition.RIGHT}
          />
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <LevelItem item={item} />}
        viewabilityConfig={levelItemsConfig}
        onViewableItemsChanged={viewableItemsChanged}
        keyExtractor={(item, index) => `${item[index].id}`}
      />

      <PaginationIndicator
        levels={level.levels}
        activeViewIndex={activeViewIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: windowWidth * 10,
    // height: windowHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelsList: {
    width: windowWidth,
  },
});
