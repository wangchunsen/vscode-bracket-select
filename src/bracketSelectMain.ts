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

function isNextToBracket(text: string, backwardStarter: number, forwardStarter: number): Boolean {
    if (backwardStarter < 0 || forwardStarter >= text.length) {
        return false;
    }

    let backwardChar = text.charAt(backwardStarter);
    let forwardChar = text.charAt(forwardStarter);
    return bracketUtil.isMatch(backwardChar, forwardChar);
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

function getSearchContext() {
    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
    let selectionStart = editor.document.offsetAt(editor.selection.anchor);
    let selectionEnd = editor.document.offsetAt(editor.selection.active);
    if (selection.isReversed) {
        //exchange
        [selectionStart, selectionEnd] = [selectionEnd, selectionStart]
    }
    return {
        backwardStarter: selectionStart - 1, //coverage vscode selection index to text index
        forwardStarter: selectionEnd,
        text: editor.document.getText()
    }
}

function doSelection(start: number, end: number) {
    const editor = vscode.window.activeTextEditor;
    editor.selection = new vscode.Selection(
        editor.document.positionAt(start + 1), //convert text index to vs selection index
        editor.document.positionAt(end));
}

function selectText() {
    const searchContext = getSearchContext();
    let { text, backwardStarter, forwardStarter } = searchContext;
    if (backwardStarter < 0 || forwardStarter >= text.length) {
        return;
    }
    let selectionStart: number, selectionEnd: number;
    if (isNextToBracket(text, backwardStarter, forwardStarter)) {
        selectionStart = backwardStarter - 1;
        selectionEnd = forwardStarter + 1;
    } else {
        const backwardResult = findBackward(searchContext.text, searchContext.backwardStarter);
        const forwardResult = findForward(searchContext.text, searchContext.forwardStarter);
        if (!bracketUtil.isMatch(backwardResult.bracket, forwardResult.bracket)) {
            showInfo('Unmatched bracket pair')
            return;
        }
        selectionStart = backwardResult.offset;
        selectionEnd = forwardResult.offset;
    }
    doSelection(selectionStart, selectionEnd);
}


//This is the main extension point
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('bracket-select.select', function () {
            selectText()
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}