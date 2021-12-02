import * as vscode from "vscode";
import * as path from "path";

export const assetsPath = "dist/assets";
export function getDiskPath(
    context: vscode.ExtensionContext,
    fileName: string
) {
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, assetsPath, fileName)
    );
    return onDiskPath.with({ scheme: "vscode-resource" });
}

export function getWebviewContent(css: vscode.Uri[], js: vscode.Uri[]) {
    const styles = css
        .map((item) => `<link rel="stylesheet" href="${item}" />`)
        .join("\n");
    const scripts = js
        .map((item) => `<script type="module" src="${item}"></script>`)
        .join("\n");

    return `<!DOCTYPE html>
	<html lang="en">
	<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${styles}
	</head>
	<body>
        <div id="app"></div>
        ${scripts}
	</body>
	</html>`;
}
