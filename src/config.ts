import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration('intlExtractor');

const ignoreTokens = config.get<string[]>('ignoreTokens') || ['a', 'an', 'the', '.', ','];
const messageComponent = config.get<string>('messageComponent') || 'FormattedMessage';
const messagesFilePath = config.get<string>('messagesFilePath');
const messageIdPrefix = config.get<string>('messageIdPrefix') || 'TR';
const trailingComma = config.get<boolean>('trailingComma') || true;

export default {
    ignoreTokens,
    messageComponent,
    messagesFilePath,
    messageIdPrefix,
    trailingComma
};
