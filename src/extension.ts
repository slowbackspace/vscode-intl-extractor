// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import config from './config';
import { generateMessageId, removeNewLines } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.extractMessage', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selectedText = removeNewLines(editor.document.getText(editor.selection));
        const messageId = generateMessageId(selectedText);

        const messageObject = {
            [messageId]: {
                id: messageId,
                defaultMessage: selectedText
            }
        };

        const messageObjectStr = JSON.stringify(messageObject, null, 4)
            .slice(1, -1)
            .trim(); // remove first and last char (curly brackets);

        // TODO: handle values
        editor.edit(builder => {
            builder.replace(
                editor.selection,
                `<${config.messageComponent} {...messages.${messageId}} />`
            );
        });

        vscode.env.clipboard.writeText(messageObjectStr);
        vscode.window.showInformationMessage('Copied to clipboard');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
