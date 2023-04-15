import * as React from "react";
import { TFile } from "obsidian";
import { useApp } from "./hooks";
import { NoteView } from "./NoteView";

export const NoteListView = () => {
    const { vault } = useApp();
    const [files, setFiles] = React.useState<TFile[]>([]);
    const [contents, setContents] = React.useState<HTMLElement[]>([]);

    React.useEffect(() => {
        const getFiles = async () => {
            const files = await vault.getMarkdownFiles();
            setFiles(files);
        };
        getFiles();
    }, []);

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