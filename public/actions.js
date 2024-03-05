import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Output, ErrorTypes, OutputFactory } from './outputs.js';

class Action {

    constructor(name, method, test) {
        this.name = name;
        this.method = method;
        this.test = test;
    }

    callWithData(callback, data) {
        console.log('data: ' + JSON.stringify(data));

        var response = new Output();
        console.log('old response: ' + JSON.stringify(response));

        var testResults = this.test(data);
        console.log('testResults: ' + JSON.stringify(testResults));

        response.mergeStatus(testResults);
        response.mergeMessages(testResults);
        response.data = [];
        console.log('new response: ' + JSON.stringify(response));

        if (response.status) { 
            data.callback = callback;
            data.output = response;
            this.method({ ...data});
        } else {
            callback.error(response);
        }
    }

    call(callback) {
        var inputs = this.#requireInput();
        console.log('inputs: ' + JSON.stringify(inputs));

        var response = new Output();
        console.log('old response: ' + JSON.stringify(response));

        var testResults = this.test(inputs);
        console.log('testResults: ' + JSON.stringify(testResults));

        response.mergeStatus(testResults);
        response.mergeMessages(testResults);
        response.data = [];
        console.log('new response: ' + JSON.stringify(response));

        if (response.status) { 
            inputs.callback = callback;
            inputs.output = response;
            this.method({ ...inputs});
        } else {
            callback.error(response);
        }
    }

    #requireInput() {
        var inputsNames = this.method.toString()
        .match(/\(([^)]+)\)/)[1]  // Extract the parameters string inside the parentheses
        .replace(/[{}]/g, '')     // Remove curly braces
        .split(',')               // Split the string into an array by commas
        .map(name => name.trim()) // Trim whitespace from each parameter name
        .filter(name => name !== 'callback' && name !== '' && name !== 'output'); // Remove 'callback' and empty strings    
        var translatedInputsNames = {
            id: "מס' מזהה",
            fullname: "שם מלא",
            phoneNumber: "מספר טלפון",
            email: "כתובת אימייל",
            limit: "מספר מקסימלי של משתמשים",
        };
        console.log('inputsNames: ' + inputsNames);
        console.log('translatedInputsNames: ' + JSON.stringify(translatedInputsNames));
        var inputs = {};
        inputsNames.forEach(name => inputs[name] = prompt("אנא הכנס " + translatedInputsNames[name] + ": "));
        return inputs;
    }

}


class Actions {
    static FIND_USER_ACTION = 'findUser';
    static ADD_USER_ACTION = 'addUser';
    constructor(){}
}


class ActionFactory {
    static GET(action) {
        switch (action) {
            case Actions.FIND_USER_ACTION:
                return new FindUserAction();
            case Actions.ADD_USER_ACTION:
                return new AddUserAction();
            default:
                return null;
        }
    }
}


class FindUserAction extends Action {

    static name() { return "findUser"; }

    static test({id}) {
        var output = new Output();
        if (id == null || id.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (isNaN(id)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id < 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id > 9999) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (!output.isError()) {
            var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        return output;
    }

    static method({id, callback, output}) {
        $.ajax({url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
            type: 'GET', 
            success: function (data) {
                console.log('data: ' + JSON.stringify(data));
                output.addData([data]);
                callback.success(output);

            },
            error: function (data) {
                callback.error(OutputFactory.GET_INTERNAL_SERVER_ERROR_OUTPUT(ErrorTypes.USER_NOT_FOUND));
            }
        });
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


class AddUserAction extends Action {

    static name() { return "addUser"; }

    static test({fullname, phoneNumber, email}) {
        var output = new Output();
        if (fullname == null || fullname.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT('שם מלא', ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/[^\s]/.test(fullname)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT('שם מלא', ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (phoneNumber == null || phoneNumber.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/^[0-9-]+$/.test(phoneNumber)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if ((phoneNumber.match(/-/g) || []).length) {
            var dashCount = (phoneNumber.match(/-/g) || []).length;
            if (dashCount > 1) {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            if (dashCount == 1 && phoneNumber[3] != '-') {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            phoneNumber = phoneNumber.replace(/-/g, '');
        } else if (phoneNumber.toString().length < 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.SHORT_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (phoneNumber.toString().length > 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (email == null || email.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]+(?:\.[a-zA-Z]+)*$/.test(email) || !(email.match(/@/g) || []).length === 1) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (email.length > 255) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (!output.isError()) {
            var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        return output;
    }

    static method({fullname, phoneNumber, email, callback, output}) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-7/index.php/user/append?' +
                'fullname=' + fullname + '&phoneNumber=' + phoneNumber + '&email=' + email,
            type: 'GET',
            success: function (data) {
                $.ajax({url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?email=' + email,
                    type: 'GET',
                    success: function (userData) {
                        console.log('userData: ' + JSON.stringify(userData));
                        output.addData([userData]);
                        console.log('output - after addData(): ' + JSON.stringify(output));
                        callback.success(output);
                    }
                });
            },
            error: function (data) {
                callback.error(OutputFactory.GET_INTERNAL_SERVER_ERROR_OUTPUT(ErrorTypes.USER_NOT_FOUND));
            }
        });
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


export { ActionFactory, Action, Actions};

/*

class  f{


    static callAction(action) {
        
    }


    
    _findUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
                type: 'GET',
                success: function (data) {
                    reloadTable([data]);
                }
            });
        } else {
            alert("Error. You must enter a valid id to get a specific user.");
        }
    }
    
    _addUser() {
        var fullname = prompt("Enter fullname: ");
        var phoneNumber = prompt("Enter phoneNumber: ");
        var email = prompt("Enter email: ");
        if (typeof fullname === "string" && typeof phoneNumber === "string" && typeof email === "string") {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/append?' +
                    'fullname=' + fullname + '&phoneNumber=' + phoneNumber + '&email=' + email,
                type: 'GET',
                success: function (data) {
                    reloadTable(data);
                }
            });
        } else {
            alert("Error. You can only use letters (a-z, A-Z) , digits (0-9) , and symbols ('-', '_') .")
        }
    }
    
    
    _deleteUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/delete?id=' + id,
                type: 'GET',
                success: function (data) {
                    reloadTable(data);
                }
            });
        } else {
            alert("Error. You must enter a valid id to delete a specific user.");
        }
    }
}
    
    
    function updateUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            var fullname = prompt("Enter fullname (Leave Empty For Not Changing): ");
            var phoneNumber = prompt("Enter phoneNumber(Leave Empty For Not Changing): ");
            var email = prompt("Enter email(Leave Empty For Not Changing): ");
            if (typeof fullname === "string" || typeof phoneNumber === "string" || typeof email === "string") {
                $.ajax({
                    url: 'https://ilay-apis.online/APIs/API-7/index.php/user/update?id=' + id +
                        (fullname != "" ? ('&fullname=' + fullname) :
                            (phoneNumber != "" ? ('&phoneNumber=' + phoneNumber) :
                                (email != "" ? ('&email=' + email) : ("")))),
                    type: 'GET',
                    success: function (data) {
                        reloadTable(data);
                    }
                });
            } else {
                alert("Error. You must enter a valid id to delete a specific user.");
            }
        }
}

*/