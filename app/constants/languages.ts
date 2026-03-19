import FlagEn from "../assets/icons/FlagEn";
import FlagEs from "../assets/icons/FlagEs";
import FlagFr from "../assets/icons/FlagFr";
import { Language } from "../enums/language.enum";

// Languages list
export const languages = [
  {
    language: Language.EN,
    label: "english",
    icon: FlagEn,
  },
  {
    language: Language.FR,
    label: "french",
    icon: FlagFr,
  },
  {
    language: Language.ES,
    label: "spanish",
    icon: FlagEs,
  },
];
