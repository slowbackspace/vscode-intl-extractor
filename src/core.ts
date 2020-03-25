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

    // write to json file
    if (['json'].includes(messageFile.languageId)) {
        const messagesRange = new vscode.Range(
            0,
            messageFile.lineAt(0).range.start.character,
            messageFile.lineCount - 1,
            messageFile.lineAt(messageFile.lineCount - 1).range.end.character
        );

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

    // write to ts/js file
    if (
        ['typescriptreact', 'typescript', 'javascript', 'javascriptreact'].includes(
            messageFile.languageId
        )
    ) {
        let messageFileText = messageFile.getText();
        const re = /defineMessages\((.*?)(.as const)?\);/gms; // hacky way to get an object passed as param to defineMessages func
        const result = re.exec(messageFileText);
        if (!result || result.length < 2) {
            throw new Error("Couldn't parse the message file");
        }
        const content = result[1];
        const startPos = messageFile.positionAt(result.index + 15); // 15 chars of defineMessages(
        const endPos = messageFile.positionAt(result.index + 15 + content.length - 1 - 2);

        const messagesRange = new vscode.Range(startPos, endPos);

        // write new message to json file
        const messageObject: { [key: string]: MessageDescriptor } = {
            [message.id]: message
        };
        let messageObjectStr = JSON.stringify(messageObject, null, 4)
            .slice(1, -1)
            .trim(); // remove first and last char (curly brackets);

        if (config.trailingComma) {
            messageObjectStr += ',';
        }

        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.insert(
            messageFile.uri,
            endPos.translate(undefined, 2),
            '\n' + messageObjectStr
        );
        await vscode.workspace.applyEdit(workspaceEdit);
    }
};
