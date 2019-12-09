// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export const removeNonAscii = (text: string) => {
    return text.replace(/[^\x00-\x7F]/g, '');
};

export const generateMessageId = (text: string, minLength = 25) => {
    const tokens = removeNonAscii(text)
        .trim()
        .split(' ')
        .map(t => t.trim().toUpperCase());
    let id = 'TR';
    let i = 0;
    while (id.length < minLength && i < tokens.length) {
        id += '_' + tokens[i];
        i++;
    }
    return id;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "intlextractor" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.extractMessage', () => {
        const editor = vscode.window.activeTextEditor;
        console.log(editor);
        if (!editor) {
            return;
        }

        const selectedText = editor.document.getText(editor.selection);
        const messageId = generateMessageId(selectedText);

        const messageObject = {
            [messageId]: {
                id: messageId,
                defaultMessage: selectedText
            }
        };

        const messageObjectStr = JSON.stringify(messageObject).slice(1, -1); // remove first and last char (curly brackets);

        vscode.env.clipboard.writeText(messageObjectStr);
        vscode.window.showInformationMessage('Copied to clipboard');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
