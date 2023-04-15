import * as React from "react";
import { App, ItemView, TFile, Vault, MarkdownRenderer, WorkspaceLeaf } from "obsidian";
import { useApp } from "./hooks";
import * as ReactDOM from "react-dom";

export const ReactView = () => {
    const app = useApp();
    const [files, setFiles] = React.useState<TFile[]>([]);
    const [contents, setContents] = React.useState<HTMLElement[]>([]);

    React.useEffect(() => {
        const getFiles = async () => {
            const files = await app.vault.getMarkdownFiles();
            setFiles(files);
        };
        getFiles();
    }, []);

    React.useEffect(() => {
        const getContents = async () => {
            const promises = files.map(async (file) => {
                const contentEl = document.createElement('div');
                const mdStr = await app.vault.cachedRead(file);
                const mdStrTemp = mdStr; // firstLines(mdStr, 3); 只取前3行
                await MarkdownRenderer.renderMarkdown(
                    mdStrTemp,
                    contentEl,
                    file.path,
                    null,
                );
                return contentEl;
            })
            const contents = await Promise.all(promises);
            setContents(contents);
        };

        if (files.length > 0) {
            getContents();
        }
    }, [files]);

    // 这个key目前这样用的话，文件内容更新时文档不会更新

    return (<>
        <ul className="notelist">
            {contents.map((content, index) => (
                <li key={files[index].path}>
                    <NoteView time={formatTimestamp(files[index].stat.ctime)}
                        title={files[index].path.slice(0, -3)}
                        domEl={content} ></NoteView>
                </li>

            ))}
        </ul >
    </>);
};

interface NoteProp {
    time: string,
    title: string,
    domEl: HTMLElement
}

const NoteView: React.FC<NoteProp> = ({ time, title, domEl }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            const node = ReactDOM.findDOMNode(ref.current);
            node?.empty();
            node?.appendChild(domEl);
        }
    }, [domEl])

    return (
        <div className="note">
            <div className="note-title">{title}</div>
            <div className="note-time">{time}</div>
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