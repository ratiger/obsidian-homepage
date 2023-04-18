import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { NoteListView } from "./NoteListView";
import { createRoot } from "react-dom/client";
import { PluginContext } from "./context";
import MyPlugin from "main";

export const VIEW_TYPE_HOMEPAGE = "homepage-view";

export class HomePageView extends ItemView {
    plugin: MyPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: MyPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_HOMEPAGE;
    }

    getDisplayText() {
        return "我的主页";
    }

    async onOpen() {
        const root = createRoot(this.containerEl.children[1]);
        root.render(
            <PluginContext.Provider value={this.plugin}>
                <NoteListView />
            </PluginContext.Provider>
        );
    }

    async onClose() {
        this.contentEl.empty();
    }
}