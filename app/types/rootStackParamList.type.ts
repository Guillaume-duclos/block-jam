import { Screen } from "../enums/screen.enum";
import { Level } from "./level.type";

type RootStackParamList = {
  [Screen.TUTORIAL]: undefined;
  [Screen.MENU]: undefined;
  [Screen.PLAYGROUND]: { level: Level; difficultyIndex: number };
  [Screen.SETTINGS]: undefined;
  [Screen.SETTINGS_MENU]: undefined;
  [Screen.PRIVACY_POLICY]: undefined;
  [Screen.TERMS_OF_USE]: undefined;
};

export default RootStackParamList;
