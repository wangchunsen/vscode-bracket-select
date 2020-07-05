'use strict';

export namespace bracketUtil {

    const vs = require("vscode");
    let bracketPairs = vs.workspace.getConfiguration('bracket-select').get('bracketPairs');
    let sameBracket = vs.workspace.getConfiguration('bracket-select').get('sameBracket');

    export function isMatch(open: string, close: string): Boolean {
        if (isSameBracket(open)) {
            return open === close;
        } 
        return bracketPairs.findIndex(p => p[0] === open && p[1] === close) >= 0;
    }

    export function isOpenBracket(char: string): Boolean {
        return bracketPairs.findIndex(pair => pair[0] === char) >= 0;
    }

    export function isCloseBracket(char: string): Boolean {
        return bracketPairs.findIndex(pair => pair[1] === char) >= 0;
    }

    export function isSameBracket(char: string): Boolean {
        return sameBracket.indexOf(char) >= 0;
    }
}
