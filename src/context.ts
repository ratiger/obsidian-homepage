import * as React from "react";
import MyPlugin from "main";

export const PluginContext = React.createContext<MyPlugin | undefined>(undefined);

export const usePlugin = (): MyPlugin => {
    const ctx = React.useContext(PluginContext);
    if (!ctx) {
        throw new Error('Missing PluginContext provider.')
    }
    return ctx;
}