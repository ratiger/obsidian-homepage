import * as React from "react";
import { TFile } from "obsidian";
import { usePlugin } from "./context";
import { NoteView } from "./NoteView";

const useRootPath = () => {
    const plugin = usePlugin();
    const [rootPath, setRootPath] = React.useState(plugin.settings.rootPath);

    React.useEffect(() => {
        console.log('add shit');
        const changeRootPath = (e: CustomEvent) => {
            setRootPath(e.detail);
            console.log('receive shit', e.detail);
        };
        window.addEventListener("changeRootPath", changeRootPath);
        return () => {
            console.log('remove shit');
            window.removeEventListener("changeRootPath", changeRootPath);
        };
    }, []);

    return rootPath;
}

const useFiles = () => {
    const vault = usePlugin().app.vault;
    const rootPath = useRootPath();
    const [files, setFiles] = React.useState<TFile[]>([]);

    React.useEffect(() => {
        const getFiles = async () => {
            const files = vault.getMarkdownFiles()
                .filter((file) => {
                    return file.parent.path.startsWith(rootPath);
                });
            setFiles(files);
        };
        getFiles();
    }, [rootPath]);

    return files;
}

export const NoteListView = () => {
    const files = useFiles();

    return (
        <ul className="notelist">
            {files.map((file) => (
                <li key={file.path + file.stat.mtime}>
                    <NoteView file={file} />
                </li>
            ))}
        </ul>
    );
};