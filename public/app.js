
import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { FormController } from './formConroller.js';




export function initPage() {
    $(document).ready(function() {
        $("#error_display_div").hide();
        $("#success_display_div").hide();
        document.getElementById('details_form').addEventListener('submit', function(event) {
            event.preventDefault();
            var details = {};
            var form = document.getElementById('details_form');
            var formData = new FormData(form);
            formData.forEach(function(value, key){
                details[key] = value;
            });
            onSubmitDetailsForm(details);
        });
    });
 //   

}


export function onSubmitDetailsForm(details) {
    FormController.EXECUTE_ADD_ACTION(details);
}


export function a() {
   // alert("Page loadsfdged");
   // alert("Page loaded");
}
