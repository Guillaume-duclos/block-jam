import { useIsFocused } from "@react-navigation/native";
import React, { createContext, ReactNode, useContext } from "react";

const FocusContext = createContext<boolean>(true);

export const useFocusContext = () => useContext(FocusContext);

type Props = {
  children: ReactNode;
};

export const FocusProvider = ({ children }: Props) => {
  const isFocused = useIsFocused();

  return (
    <FocusContext.Provider value={isFocused}>{children}</FocusContext.Provider>
  );
};
