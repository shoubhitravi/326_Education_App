document.addEventListener('DOMContentLoaded', function() {
    var trigger = document.querySelector('.trigger');
    var popup = document.getElementById('popupDefinition');

    trigger.addEventListener('click', function() {
        // var isPopupVisible = popup.style.display === 'block';
        // popup.style.display = isPopupVisible ? 'none' : 'block';

        // if(!isPopupVisible){
        //     popup.style.left = trigger.offsetLeft + 'px';
        //     popup.style.top = trigger.offsetTop + trigger.offsetHeight + 'px'
        // }

        if(popup.innerHTML === ''){
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