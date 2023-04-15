import * as React from "react";
import { TFile, MarkdownRenderer } from "obsidian";
import { useApp } from "./hooks";
import * as ReactDOM from "react-dom";

interface NoteProp {
    file: TFile
}

const useContentEl = (file: TFile) => {
    const { vault } = useApp();
    const [contentEl, setContentEl] = React.useState<HTMLElement>();
    React.useEffect(() => {
        const getContent = async () => {
            const contentEl = document.createElement('div');
            const mdStr = await vault.cachedRead(file);
            const mdStrTemp = mdStr; // firstLines(mdStr, 3); 只取前3行
            await MarkdownRenderer.renderMarkdown(
                mdStrTemp,
                contentEl,
                file.path,
                null,
            );
            setContentEl(contentEl);
        };
        getContent();
    }, [file]);
    return contentEl;
}

export const NoteView: React.FC<NoteProp> = ({ file }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const contentEl = useContentEl(file);

    React.useEffect(() => {
        if (ref.current) {
            const node = ReactDOM.findDOMNode(ref.current);
            node?.empty();
            if (contentEl) {
                node?.appendChild(contentEl);
            }
        }
    }, [contentEl]);

    return (
        <div className="note">
            <div className="note-title">{file.path.slice(0, -3)}</div>
            <div className="note-time">{formatTimestamp(file.stat.ctime)}</div>
            <div className="note-content" ref={ref}></div>
        </div>
    );
}

function firstLines(str: string, num: number = 3): string {
    const lines = str.split(/\r?\n/);
    const few = lines.slice(0, num);
    return few.join("\r\n");
}

function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
}