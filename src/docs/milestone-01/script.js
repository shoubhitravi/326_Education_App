/**
 * Sets up event listeners after the DOM content has fully loaded.
 * This script initializes interaction with a popup when a specific trigger element is clicked.
 * The popup's content is dynamically set based on whether it is currently visible or not.
 */
document.addEventListener('DOMContentLoaded', function() {
     /**
     * The trigger element that when clicked, will show or hide the popup with additional information.
     * @type {HTMLElement}
     */
    var trigger = document.querySelector('.trigger');

    /**
     * The popup element where dynamic content is displayed.
     * @type {HTMLElement}
     */
    var popup = document.getElementById('popupDefinition');

     /**
     * Adds a click event listener to the trigger. On click, if the popup is empty, it fills the popup with content
     * and displays it. If the popup is already filled, it clears the content and hides the popup.
     */
    trigger.addEventListener('click', function() {
        if(popup.innerHTML === ''){
            // Populate and display the popup if it is initially empty
            popup.innerHTML = '<b>Since Luke is the pinnacle of human athleticism, his wingspan allows him to literally levitate!</b>';
            popup.style.display = 'block';
            trigger.classList.add('trigger-active');
        }
        else {
            popup.innerHTML = '';
            popup.style.display = 'none';
            trigger.classList.remove('trigger-active');
        }

    })
});