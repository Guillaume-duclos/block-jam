import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getStorageString, setStorageItem } from "../utils/storage";
import { StorageKey } from "../enums/storageKey.enum";
import { Language } from "../enums/language.enum";
import en from "./languages/en.json";
import fr from "./languages/fr.json";

const initI18n = async () => {
  let savedLanguage = getStorageString(StorageKey.LANGUAGE);

  const resources = {
    en: { translation: en },
    fr: { translation: fr },
  };

  if (!savedLanguage) {
    const local = Localization.getLocales()[0]?.languageCode || Language.EN;

    savedLanguage = local === Language.FR ? local : Language.EN;

    setStorageItem(StorageKey.LANGUAGE, savedLanguage);
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: Language.EN,
    interpolation: { escapeValue: false },
  });
};

initI18n();

export default i18n;
