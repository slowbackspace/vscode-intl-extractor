import * as vscode from 'vscode';
import * as path from 'path';
import { MessageDescriptor } from './types';
import { removeNonAscii, filterTokens } from './utils';
import config from './config';

const WORKSPACE_ROOT = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';

export const generateMessageId = (text: string, minLength = 25) => {
    const rawTokens = removeNonAscii(text).split(' ');
    const tokens = filterTokens(rawTokens, config.ignoreTokens);

    let id = config.messageIdPrefix;
    let i = 0;
    while (id.length < minLength && i < tokens.length) {
        id += '_' + tokens[i].toUpperCase();
        i++;
    }
    return id;
};

export const writeMessageToFile = async (messagesFilePath: string, message: MessageDescriptor) => {
    // TODO: what about multiroot workspaces?
    const fullPath = path.join(WORKSPACE_ROOT, messagesFilePath);
    const messageFile = await vscode.workspace.openTextDocument(fullPath);
    const messagesRange = new vscode.Range(
        0,
        messageFile.lineAt(0).range.start.character,
        messageFile.lineCount - 1,
        messageFile.lineAt(messageFile.lineCount - 1).range.end.character
    );

    // write to json file
    if (['json'].includes(messageFile.languageId)) {
        let messageFileJson;
        if (messageFile.getText().trim() === '') {
            // file is empty
            messageFileJson = JSON.parse('{}');
        } else {
            // parse json
            messageFileJson = JSON.parse(messageFile.getText());
        }
        // write new message to json file
        const content: { [key: string]: MessageDescriptor } = messageFileJson;
        content[message.id] = message;
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.delete(messageFile.uri, messagesRange);
        workspaceEdit.insert(
            messageFile.uri,
            new vscode.Position(0, 0),
            JSON.stringify(content, null, 4)
        );
        await vscode.workspace.applyEdit(workspaceEdit);
    }
};
