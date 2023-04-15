import { AppContext } from "./context";
import * as React from "react";
import { App } from "obsidian";

export const useApp = (): App => {
  return React.useContext(AppContext);
};