import { App, PluginSettingTab, Setting, Vault } from 'obsidian';
import MyPlugin from "./MyPlugin";

export class RootSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h1', { text: '基础选项' });

        new Setting(containerEl)
            .setName('展示该目录下的所有笔记')
            .setDesc('默认是根目录')
            .addDropdown((cb) => {
                const getAllFolders = (vault: Vault) => {
                    const files = vault.getFiles();
                    const folders = files.map((file) => {
                        return file.parent.path;
                    });
                    return [...new Set(folders)];
                }
                const folders = getAllFolders(this.app.vault);
                folders.forEach((path) => {
                    cb.addOption(path, path);
                });
                cb.setValue(this.plugin.settings.rootPath)
                    .onChange((newFolder) => {
                        this.plugin.changeRoot(newFolder);
                    });
            });
    }
}