'use strict';

export namespace bracketUtil {
    let openBarcket = ['(', '{', '[']
    let closeBracket = [')', '}', ']']
    let quoteBrackets = ['"', "'"]

    export function isMatch(open: string, close: string): Boolean {
        let opentIndex = openBarcket.indexOf(open)
        if (opentIndex >= 0) {
            return closeBracket[opentIndex] == close;
        } else if (isQuoteBracket(open)) {
            return open == close;
        }
        return false;
    }

    export function isOpenBracket(char: string): Boolean {
        return openBarcket.indexOf(char) >= 0;
    }

    export function isCloseBracket(char: string): Boolean {
        return closeBracket.indexOf(char) >= 0;
    }

    export function isQuoteBracket(char: string): Boolean {
        return quoteBrackets.indexOf(char) >= 0;
    }
}