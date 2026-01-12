import { Screen } from "../enums/screen.enum";

type RootStackParamList = {
  [Screen.TUTORIAL]: undefined;
  [Screen.MENU]: undefined;
  [Screen.PLAYGROUND]: { levelIndex: number; difficultyIndex: number };
  [Screen.SETTINGS]: undefined;
  [Screen.SETTINGS_MENU]: undefined;
  [Screen.PRIVACY_POLICY]: undefined;
  [Screen.TERMS_OF_USE]: undefined;
};

export default RootStackParamList;
