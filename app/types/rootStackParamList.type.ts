import { Screen } from "../enums/screen.enum";
import Level from "./level";

type RootStackParamList = {
  [Screen.TUTORIAL]: undefined;
  [Screen.MENU]: undefined;
  [Screen.PLAYGROUND]: { level: Level };
  [Screen.SETTINGS]: undefined;
};

export default RootStackParamList;
