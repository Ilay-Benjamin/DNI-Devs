import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery

class Output {
    constructor (status = true, data = [], ...messages) {
        if (data == null) {
            this.data = [];
        }
        if (messages == null) {
            this.messages = [];
        }
        if (status == null) {
            this.status = true;
        }
        this.data = data;
        this.status = status;
        this.messages = messages;
    }

    isError() {
        return !this.status;
    }

    addMessage(...messages) {
        this.messages.push(messages);
    }

    addData(otherData = []) {
        this.data.push(...otherData);
    }

    mergeMessages(otherOutput = []) {
        this.messages.push(...otherOutput.messages);        
    }

    mergeStatus(otherOutput) {
        this.status = this.status && otherOutput.status;
    }
}


class OutputTypes {
    static ACCESS_ERROR = 'ACCESS_ERROR';
    static INPUT_ERROR = 'INPUT_ERROR';
    static UNKNOWN_ERROR = 'UNKNOWN_ERROR';
    static SYSTEM_ERROR = 'SYSTEM_ERROR';
    static INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
    static SUCCESS = 'SUCCESS';
    static IS_OUTPUT_TYPE = (outputType) => {
        const types = Object.getOwnPropertyNames(ErrorTypes).filter(prop => {
            return typeof ErrorTypes[prop] !== 'function' && !['length', 'name', 'prototype'].includes(prop);
        }).map(prop => OutputTypes[prop]);
        return types.includes(outputType);
    }
}


class ErrorTypes {
    static INVALID_INPUT = 'INVALID_INPUT_ERROR';
    static EMPTY_INPUT = 'EMPTY_INPUT_ERROR';
    static SHORT_INPUT_LENGTH = 'SHORT_INPUT_LENGTH_ERROR';
    static LONG_INPUT_LENGTH = 'LONG_INPUT_LENGTH_ERROR';
    static USER_NOT_FOUND = 'USER_NOT_FOUND_ERROR';
    static INVALID_ACTION = 'INVALID_ACTION_ERROR';
    static UNAUTHORIZED = 'UNAUTHORIZED_ERROR';
    static INCORRECT_ACCESS_CODE = 'INCORRECT_ACCESS_CODE_ERROR';
    static UNKNOWN_ERROR = 'UNKNOWN_ERROR';
    static IS_ERROR_TYPE = (errorType) => { 
        const errors = Object.getOwnPropertyNames(ErrorTypes).filter(prop => {
            return typeof ErrorTypes[prop] !== 'function' && !['length', 'name', 'prototype'].includes(prop);
        }).map(prop => ErrorTypes[prop]);
        return errors.includes(errorType);
    }
}


class Messages {
    static #SUCCESS_MESSAGE = 'בוצע בהצלחה.';
    static #USER_NOT_FOUND_MESSAGE = 'שגיאה. המשתמש לא נמצא במערכת.';
    static #INVALID_ACTION_MESSAGE = 'שגיאה. פעולה לא חוקית.';
    static #UNAUTHORIZED_MESSAGE = 'שגיאה. אינך מורשה לבצע פעולה זו.';
    static #INCORRECT_ACCESS_CODE_MESSAGE = 'שגיאה. קוד גישה שגוי.';
    static #UNKNOWN_ERROR_MESSAGE = 'שגיאה. משהו השתבש. נא לפנות לתמיכה.';
    static GET_SUCCESS_MESSAGE = () => {
        return Messages.#SUCCESS_MESSAGE;
    }
    static GET_INVALID_INPUT_ERROR_MESSAGE = (input, errorType) => {
        switch (errorType) {
            case ErrorTypes.EMPTY_INPUT:
                return `שגיאה. הזנת ערך ריק לשדה ${input}.`;
            case ErrorTypes.SHORT_INPUT_LENGTH:
                return `שגיאה. הזנת ערך קצר מדי לשדה ${input}.`;
            case ErrorTypes.LONG_INPUT_LENGTH:
                return `שגיאה. הזנת ערך ארוך מדי לשדה ${input}.`;
            case ErrorTypes.INVALID_INPUT:
                return `שגיאה. הזנת ערך לא חוקי לשדה ${input}.`;
            default:
                return Messages.#UNKNOWN_ERROR_MESSAGE;
        }
    }
    static GET_ACCESS_ERROR_MESSAGE = (errorType) => {
        switch (errorType) {
            case ErrorTypes.UNAUTHORIZED:
                return Messages.#UNAUTHORIZED_MESSAGE;
            case ErrorTypes.INCORRECT_ACCESS_CODE:
                return Messages.#INCORRECT_ACCESS_CODE_MESSAGE;
            default:
                return Messages.#UNKNOWN_ERROR_MESSAGE;
        }
    }
    static GET_UNKNOWN_ERROR_MESSAGE = (errorType) => {
        switch (errorType) {
                case ErrorTypes.UNKNOWN_ERROR: 
                    return Messages.#UNKNOWN_ERROR_MESSAGE;
                default: 
                    return Messages.#UNKNOWN_ERROR_MESSAGE;
        }
    }
    static GET_SYSTEM_ERROR_MESSAGE = (errorType) => {
        switch (errorType) {
            case ErrorTypes.INVALID_ACTION:
                Messages.#INVALID_ACTION_MESSAGE;
            default:
                return Messages.#UNKNOWN_ERROR_MESSAGE;
        }
    }
    static GET_INTERNAL_SERVER_ERROR_MESSAGE = (errorType) => {
        switch (errorType) {
            case ErrorTypes.USER_NOT_FOUND_MESSAGE:
                return Messages.#USER_NOT_FOUND_MESSAGE;
            default:
                return Messages.#UNKNOWN_ERROR_MESSAGE;
        }
    }
    static GET_MESSAGE = (outputType, errorType, input = '') => {
        if (input == '') {
            switch (outputType) {
                case OutputTypes.SUCCESS:
                    return Messages.GET_SUCCESS_MESSAGE();
                case OutputTypes.ACCESS_ERROR:
                    return Messages.GET_ACCESS_ERROR_MESSAGE(errorType);
                case OutputTypes.UNKNOWN_ERROR:
                    return Messages.GET_UNKNOWN_ERROR_MESSAGE(errorType);
                case OutputTypes.SYSTEM_ERROR:
                    return Messages.GET_SYSTEM_ERROR_MESSAGE(errorType);
                case OutputTypes.INTERNAL_SERVER_ERROR:
                    return Messages.GET_INTERNAL_SERVER_ERROR_MESSAGE(errorType);
                default:
                    return Messages.#UNKNOWN_ERROR_MESSAGE;
            }
        }
    }

}


class OutputFactory {
    static GET_OUTPUT(status, data = [], outputType, errorType, input = '') {
        var message = Messages.GET_MESSAGE(outputType, errorType, input);
        return new Output(status, data, message);
    }
    static GET_SUCCESS_OUTPUT(data = []) {
        if (data == null) {
            data = [];
        }
        return new Output(true, data, Messages.GET_SUCCESS_MESSAGE());
    }
    static GET_INVALID_INPUT_OUTPUT(input, errorType) {
        return new Output(false, [], Messages.GET_INVALID_INPUT_ERROR_MESSAGE(input, errorType));
    }
    static GET_ACCESS_ERROR_OUTPUT(errorType) {
        return new Output(false, [], Messages.GET_ACCESS_ERROR_MESSAGE(errorType));
    }
    static GET_UNKNOWN_ERROR_OUTPUT(errorType) {
        return new Output(false, [], Messages.GET_UNKNOWN_ERROR_MESSAGE(errorType));
    }
    static GET_SYSTEM_ERROR_OUTPUT(errorType) {
        return new Output(false, [], Messages.GET_SYSTEM_ERROR_MESSAGE(errorType));
    }
    static GET_INTERNAL_SERVER_ERROR_OUTPUT(errorType) {
        return new Output(false, [], Messages.GET_INTERNAL_SERVER_ERROR_MESSAGE(errorType));
    }
}



export {Output, ErrorTypes, OutputFactory}