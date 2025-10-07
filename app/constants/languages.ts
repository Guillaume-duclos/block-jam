import FlagEn from "../assets/icons/FlagEn";
import FlagEs from "../assets/icons/FlagEs";
import FlagFr from "../assets/icons/FlagFr";
import { Language } from "../enums/language.enum";

// Languages list
export const languages = [
  {
    language: Language.EN,
    label: "English",
    icon: FlagEn,
  },
  {
    language: Language.FR,
    label: "French",
    icon: FlagFr,
  },
  {
    language: Language.ES,
    label: "Spanish",
    icon: FlagEs,
  },
];
