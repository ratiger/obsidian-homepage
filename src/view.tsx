import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { NoteListView } from "./NoteListView";
import { createRoot } from "react-dom/client";
import { AppContext } from "./context";
export const VIEW_TYPE_HOMEPAGE = "homepage-view";

export class HomePageView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
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
            <AppContext.Provider value={this.app}>
                <NoteListView />
            </AppContext.Provider>
        );
    }

    async onClose() {
        this.contentEl.empty();
    }
}