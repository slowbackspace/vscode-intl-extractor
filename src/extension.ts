// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import config from './config';
import { removeNewLines } from './utils';
import { MessageDescriptor } from './types';
import { writeMessageToFile, generateMessageId } from './core';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.extractMessage', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const messagesFilePath = config.messagesFilePath;
        const selectedText = removeNewLines(editor.document.getText(editor.selection));
        const messageId = generateMessageId(selectedText);

        const messageObject: { [key: string]: MessageDescriptor } = {
            [messageId]: {
                id: messageId,
                defaultMessage: selectedText
            }
        };

        const messageObjectStr = JSON.stringify(messageObject, null, 4)
            .slice(1, -1)
            .trim(); // remove first and last char (curly brackets);

        // TODO: handle values
        // TODO: handle old format <${config.messageComponent} {...messages.${messageId}} />
        const component = `<${config.messageComponent} id="${messageId}}" />`;
        editor.edit(builder => {
            builder.replace(
                editor.selection,
                component
            );
        });

        vscode.env.clipboard.writeText(messageObjectStr);
        if (messagesFilePath) {
            try {
                writeMessageToFile(messagesFilePath, messageObject[messageId]);
            } catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
        vscode.window.showInformationMessage('Copied to clipboard');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
