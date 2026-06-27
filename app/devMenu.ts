import { registerDevMenuItems } from "expo-dev-menu";
import { StorageKey } from "./enums/storageKey.enum";
import { useLevelStore } from "./store/level.store";
import {
  getStorageString,
  removeAllStorage,
  removeStorageItem,
} from "./utils/storage";

const logScoreData = () => {
  const score = getStorageString(StorageKey.LEVEL_SCORE);
  console.log("Score data:", score);
};

const removeScoreData = () => {
  removeStorageItem(StorageKey.LEVEL_SCORE);
  useLevelStore.getState().resetScores();
};

const removeAllData = () => {
  removeAllStorage();
};

registerDevMenuItems([
  {
    name: "Log score data",
    callback: logScoreData,
  },
  {
    name: "Remove score data",
    callback: removeScoreData,
  },
  {
    name: "Remove all data",
    callback: removeAllData,
  },
]);
