'use strict';

export namespace bracketUtil {
    let bracketPairs = [
        ["(", ")"], 
        ["{", "}"], 
        ["[", "]"]
    ]

    let quoteBrackets = ['"', "'", "`"]

    export function isMatch(open: string, close: string): Boolean {
        if (isQuoteBracket(open)) {
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

    export function isQuoteBracket(char: string): Boolean {
        return quoteBrackets.indexOf(char) >= 0;
    }
}
