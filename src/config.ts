import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration('intlExtractor');

const ignoreTokens = config.get<string[]>('ignoreTokens') || ['a', 'an', 'the', '.', ','];
const messageComponent = config.get('messageComponent') || 'FormattedMessage';
const messagesFilePath = config.get('messagesFilePath');

export default {
    ignoreTokens,
    messageComponent,
    messagesFilePath
};
