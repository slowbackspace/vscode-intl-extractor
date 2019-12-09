import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { generateMessageId } from '../../utils';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('generate message id', () => {
        assert.equal(generateMessageId('sample text message'), '');
    });
});
