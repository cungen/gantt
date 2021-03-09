// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as pug from 'pug';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Gantt" is now activated!');

    context.subscriptions.push(vscode.commands.registerCommand('gantt.greeting', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Welcome to use Gantt!');
    }));

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('gantt.showPreview', () => {
        GanttPanel.createOrShow(context);
    }));

    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(GanttPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                GanttPanel.revive(webviewPanel, context);
            }
        });
    }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
    };
}

/**
 * Manages cat coding webview panels
 */
class GanttPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: GanttPanel | undefined;

    public static readonly viewType = 'ganttPreview';

    private readonly _context: vscode.ExtensionContext;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private readonly _indexPugCompiler: pug.compileTemplate;

    public static createOrShow(context: vscode.ExtensionContext) {
        // If we already have a panel, show it.
        if (GanttPanel.currentPanel) {
            GanttPanel.currentPanel._panel.reveal(vscode.ViewColumn.Two);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            GanttPanel.viewType,
            'Gantt Preview',
            vscode.ViewColumn.Two,
            getWebviewOptions(context.extensionUri),
        );

        GanttPanel.currentPanel = new GanttPanel(panel, context);
    }

    public static revive(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        GanttPanel.currentPanel = new GanttPanel(panel, context);
    }

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this._context = context;
        this._panel = panel;
        this._extensionUri = context.extensionUri;

        this._indexPugCompiler = pug.compileFile(path.join(this._extensionUri.fsPath, 'media', 'index.pug'));

        // Set the webview 's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }

    public dispose() {
        GanttPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        this._panel.title = '';
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = ;

        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const vueUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vue.min.js'));

        // Local path to css styles
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css');

        // Uri to load styles into webview
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return this._indexPugCompiler({
            nonce,
            webview,
            stylesMainUri: stylesMainUri.toString(),
            vueUri: vueUri.toString(),
            scriptUri: scriptUri.toString()
        });
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
