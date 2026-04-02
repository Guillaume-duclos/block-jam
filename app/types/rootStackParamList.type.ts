import { Screen } from "../enums/screen.enum";

type RootStackParamList = {
  [Screen.TUTORIAL]: undefined;
  [Screen.DIFFICULTIES_MENU]: undefined;
  [Screen.LEVELS_MENU]: { difficultyIndex: number };
  [Screen.PLAYGROUND]: { levelIndex: number; difficultyIndex: number };
  [Screen.SETTINGS]: undefined;
  [Screen.SETTINGS_MENU]: undefined;
  [Screen.PRIVACY_POLICY]: undefined;
  [Screen.TERMS_OF_USE]: undefined;
};

export default RootStackParamList;
