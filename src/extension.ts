// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import GanttPanel from "./GanttPanel";
import * as YAML from "yaml";
import { readdirSync } from "fs";
import { assetsPath, getDiskPath, getWebviewContent } from "./util";

let _panel: vscode.WebviewPanel;
let _editor: vscode.TextEditor;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log("---activate");
    const { css, js } = getAssets(context);
    setListener(context, css, js);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return "";
    }
    _editor = editor;
}

function getAssets(context: vscode.ExtensionContext) {
    const files = readdirSync(path.join(context.extensionPath, assetsPath));
    const js = [] as vscode.Uri[];
    const css = [] as vscode.Uri[];

    files.forEach((file) => {
        if (/.*\.js$/.test(file)) {
            js.push(getDiskPath(context, file));
        } else if (/.*\.css$/.test(file)) {
            css.push(getDiskPath(context, file));
        }
    });
    return { css, js };
}

function sendText(panel: vscode.WebviewPanel, str: string) {
    const textContent = YAML.parse(str);
    panel.webview.postMessage({
        command: "text",
        text: textContent,
    });
}

function setListener(
    context: vscode.ExtensionContext,
    css: vscode.Uri[],
    js: vscode.Uri[]
) {
    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            console.log("---content change");
            if (editor === undefined) return;
            if (editor.document.languageId !== "gantt") return;
            if (editor) {
                _editor = editor;
            }
            if (_panel) {
                _panel.title = editor ? _editor.document.fileName : "No File";
            }
            sendText(_panel, _editor.document.getText());
            // if (GanttPanel.currentPanel && GanttPanel.isGanttFileActive()) {
            //     GanttPanel.currentPanel.update();
            // }
        },
        null,
        context.subscriptions
    );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(
        vscode.commands.registerCommand("gantt.showPreview", () => {
            const panel = vscode.window.createWebviewPanel(
                "gantt",
                "Gantt Preview",
                vscode.ViewColumn.Beside,
                {
                    localResourceRoots: [
                        vscode.Uri.file(
                            path.join(context.extensionPath, "dist")
                        ),
                    ],
                    enableScripts: true,
                }
            );
            _panel = panel;

            _panel.webview.html = getWebviewContent(css, js);
            _panel.onDidDispose(
                (e) => {
                    // TODO
                },
                undefined,
                context.subscriptions
            );

            _panel.webview.onDidReceiveMessage((message) => {
                switch (message.command) {
                    case "text":
                        console.log("---on msg", message.text);
                        // let textDocument = _editor.document;
                        // let invalidRange = new vscode.Range(
                        //     0,
                        //     0,
                        //     textDocument!.lineCount /*intentionally missing the '-1' */,
                        //     0
                        // );
                        // let fullRange =
                        //     textDocument!.validateRange(invalidRange);
                        // _editor.edit((edit) =>
                        //     edit.replace(fullRange, message.text)
                        // );
                        return;
                }
            }, null);
            sendText(_panel, _editor.document.getText());
        })
    );

    // if (vscode.window.registerWebviewPanelSerializer) {
    //     // Make sure we register a serializer in activation event
    //     vscode.window.registerWebviewPanelSerializer(GanttPanel.viewType, {
    //         async deserializeWebviewPanel(
    //             webviewPanel: vscode.WebviewPanel,
    //             state: any
    //         ) {
    //             // console.log(`Got state: ${state}`);
    //             // Reset the webview options so we use latest uri for `localResourceRoots`.
    //             // webviewPanel.webview.options = GanttPanel.getWebviewOptions(
    //             //     context.extensionUri
    //             // );
    //             // GanttPanel.revive(webviewPanel, context);
    //         },
    //     });
    // }
}

export function deactivate() {
    // TODO
}
