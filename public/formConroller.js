import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Action, Actions, ActionFactory } from './actions.js';


export class FormController {

    static ACTION = ActionFactory.GET(Actions.ADD_USER_ACTION);
    
    static LOAD_FORM() {
        $('#name_input').val('');
        $('#email_input').val('');
        $('#phone_input').val('');
    }

    static RELOAD_FORM() {
        FormController.CLOSE_ERROR_MESSAGE();
        FormController.CLOSE_SUCCESS_MESSAGE();
        this.LOAD_FORM();
    }

    static SHOW_ERROR_MESSAGE(output) {
        const messages = output.messages;
        FormController.CLOSE_SUCCESS_MESSAGE();
        $("#error_display_div").show();
        var text = "";
        messages.forEach((message, index) => {
            if (index > 0) {
                text += "<br>"; // Add a line break before each subsequent message
            }
            text += message; // Append the message
        });
        $("#error_display_p").html(text); // Use .html() to render the line breaks
    }

    static CLOSE_ERROR_MESSAGE() {
        $("#error_display_div").hide();
        $("#error_display_p").html('');
    }

    static SHOW_SUCCESS_MESSAGE(output) {
        FormController.CLOSE_ERROR_MESSAGE();
        $("#success_display_div").show();
        var user = output.data[0];
        var text = "";
        text += "מספר מזהה" + ": " + user.id + "<br>";
        text += "שם מלא" + ": " + user.fullname + "<br>";
        text += "אימייל" + ": " + user.email + "<br>";
        text += "מספר טלפון" + ": " + user.phoneNumber + "<br>";
        $("#success_display_p").html(text);
    }

    static CLOSE_SUCCESS_MESSAGE() {
        $("#success_display_div").hide();
        $("#success_display_p").html('');
    }

    static EXECUTE_ADD_ACTION(details) {
        var callback = {
            success: function (output) {
                FormController.RELOAD_FORM ();
                FormController.SHOW_SUCCESS_MESSAGE(output);
            },
            error: function (output) {
                FormController.SHOW_ERROR_MESSAGE(output);
            }
        }
        
        FormController.ACTION.callWithData(callback, details);
    }
    
} 




