import { MMKV } from "react-native-mmkv";
import { StorageKey } from "../enums/storageKey.enum";

const storage = new MMKV();

// Get string value from storage
export const getStorageString = (key: StorageKey): string | undefined => {
  return key ? storage.getString(key) : undefined;
};

// Get number value from storage
export const getStorageNumber = (key: StorageKey): number | undefined => {
  return key ? storage.getNumber(key) : undefined;
};

// Get boolean value from storage
export const getStorageBoolean = (key: StorageKey): boolean | undefined => {
  return key ? storage.getBoolean(key) : undefined;
};

// Set item value from storage
export const setStorageItem = (
  key: StorageKey,
  value: string | number | boolean
): void => {
  key && storage.set(key, value);
};

// Set object value from storage
export const setStorageObject = <T>(key: StorageKey, value: T): void => {
  key && storage.set(key, JSON.stringify(value));
};

// Get if storage value exist
export const isStorageContains = (key: StorageKey): boolean | undefined => {
  return key ? storage.contains(key) : undefined;
};

// Get storage saved key
export const getStorageKeys = (): string[] => {
  return storage.getAllKeys();
};

// Remove storage value
export const removeStorageItem = (key: StorageKey): void => {
  key && storage.delete(key);
};

// Remove all storage values
export const removeAllStorage = (): void => {
  storage.clearAll();
};
