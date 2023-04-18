import { App, Notice, Plugin, PluginSettingTab, Setting, Vault } from 'obsidian';
import { HomePageView, VIEW_TYPE_HOMEPAGE } from "./src/HomePageView";

interface MyPluginSettings {
	rootPath: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	rootPath: '/'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log("on load");
		await this.loadSettings();

		// 视图
		this.registerView(
			VIEW_TYPE_HOMEPAGE,
			(leaf) => new HomePageView(leaf, this)
		);

		// 左侧工具栏的图标
		const ribbonIconEl = this.addRibbonIcon('home', 'Home Page', (evt: MouseEvent) => {
			new Notice('Hello, you!!!');
			this.activateView();
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// 状态栏
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text statusBarItemEl');

		// 命令（及快捷键）
		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// 设置项
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RootSettingTab(this.app, this));

		// 监听事件
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// 定时器
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("on unload");
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_HOMEPAGE);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_HOMEPAGE); // 清除当前view，使得只保留一个

		await this.app.workspace.getLeaf(true).setViewState({
			type: VIEW_TYPE_HOMEPAGE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE)[0]
		);
	}

	changeRoot(rootPath: string) {
		this.settings.rootPath = rootPath;
		this.saveSettings();
		if (this.app.workspace.getActiveViewOfType(HomePageView)) {
			const e = new CustomEvent("changeRootPath", {
				detail: rootPath
			});
			console.log('emit shit', rootPath);
			window.dispatchEvent(e);
		}
	}
}

class RootSettingTab extends PluginSettingTab {
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