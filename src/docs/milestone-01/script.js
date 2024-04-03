document.addEventListener('DOMContentLoaded', function() {
    var trigger = document.querySelector('.trigger');
    var popup = document.getElementById('popupDefinition');

    trigger.addEventListener('click', function() {
        var isPopupVisible = popup.style.display === 'block';
        popup.style.display = isPopupVisible ? 'none' : 'block';

        if(!isPopupVisible){
            popup.style.left = trigger.offsetLeft + 'px';
            popup.style.top = trigger.offsetTop + trigger.offsetHeight + 'px'
        }
    })
});