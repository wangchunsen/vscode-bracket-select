'use strict';

export namespace bracketUtil {

    export function isMatch(open: String, close: String): Boolean {
        switch (open) {
            case '(':
                return close === ')';
            case '{':
                return close === '}';
            case '[':
                return close === ']'
        }
        return false;
    }

    export function isOpenBracket(char: String): Boolean {
        return char === '('
            || char === '['
            || char === '{';
    }

    export function isCloseBracket(char: String): Boolean {
        return char === ')'
            || char === ']'
            || char === '}';
    }
}