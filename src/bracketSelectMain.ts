'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { bracketUtil } from './bracketUtil';


class SearchResult {
    bracket: string;
    offset: number;

    constructor(bracket: string, offset: number) {
        this.bracket = bracket;
        this.offset = offset;
    }
}

function findBackward(text: string, index: number): SearchResult {
    const bracketStack: string[] = [];
    let offset = 0;
    let bracket: string = '';
    for (let i = index; i >= 0; i--) {
        let char = text.charAt(i);
        if (bracketUtil.isOpenBracket(char)) {
            if (bracketStack.length == 0) {
                bracket = char;
                offset = i;
                break;
            } else {
                let top = bracketStack.pop();
                if (!bracketUtil.isMatch(char, top)) {
                    throw 'Unmatched bracket pair';
                }
            }
        } else if (bracketUtil.isCloseBracket(char)) {
            bracketStack.push(char);
        }
    }
    return new SearchResult(bracket, offset);
}

function findForward(text: string, index: number): SearchResult {
    const bracketStack: string[] = [];
    let offset = text.length;
    let bracket: string = '';
    for (let i = index; i < text.length; i++) {
        let char = text.charAt(i);
        if (bracketUtil.isCloseBracket(char)) {
            if (bracketStack.length == 0) {
                offset = i;
                bracket = char;
                break;
            } else {
                let top = bracketStack.pop();
                if (!bracketUtil.isMatch(top, char)) {
                    throw 'Unmatched bracket pair'
                }
            }
        } else if (bracketUtil.isOpenBracket(char)) {
            bracketStack.push(char);
        }
    }
    return new SearchResult(bracket, offset);
}

function showInfo(msg: string): void {
    vscode.window.showInformationMessage(msg);
}

function selectText(includeBracket: boolean) {
    const editor = vscode.window.activeTextEditor;
    const offset = editor.document.offsetAt(editor.selection.active);
    const text = editor.document.getText();
    try {
        const backwardResult = findBackward(text, offset - 1);
        const forwardResult = findForward(text, offset);
        if (!bracketUtil.isMatch(backwardResult.bracket, forwardResult.bracket)) {
            showInfo('Unmatched bracket pair')
            return;
        }
        let selectionStart = backwardResult.offset < text.length ? backwardResult.offset + 1 : backwardResult.offset;
        let selectionEnd = forwardResult.offset;
        if(includeBracket){
            selectionStart -= 1;
            selectionEnd += 1;
        }
        editor.selection = new vscode.Selection(editor.document.positionAt(selectionStart), editor.document.positionAt(selectionEnd));
    } catch (error) {
        showInfo(error)
    }
}


//This is the main extension point
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('bracket-select.select', function () {
            selectText(false)
        }),
        vscode.commands.registerCommand('bracket-select.selectInclude', function () {
            selectText(true);
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}