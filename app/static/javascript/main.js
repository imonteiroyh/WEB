function swapTheme(sheet){
    document.getElementById('theme').setAttribute('href', 'css/' + sheet);
    localStorage.setItem('sheet', sheet);
}

function applyThemeBasedOnRoute() {
    var currentRoute = window.location.pathname;

    if (currentRoute === '/login') {
        swapTheme('styles.css');
    } else {
        swapTheme(localStorage.getItem('sheet') || 'styles.css');
    }
}
function increaseFontSize() {
    var element = document.getElementById("valueFontSize");
    var size = window.getComputedStyle(element, null).getPropertyValue("font-size");
    var newSize = (parseInt(size)<30) ? parseInt(size) + 2 : 30;
    localStorage.setItem('fontSize', newSize + 'px');

    var elementTitle = document.querySelector('.main-title');
    if(elementTitle){
        var sizeTitle = window.getComputedStyle(elementTitle, null).getPropertyValue("font-size");
        var newSizeTitle = (parseInt(sizeTitle)<44) ? parseInt(sizeTitle) + 2 : 44 ;
        localStorage.setItem('fontSizeTitle', newSizeTitle + 'px');
    }
    else{
        if(localStorage.getItem('fontSizeTitle')){
            var sizeTitle = localStorage.getItem('fontSizeTitle');
            var newSizeTitle = (parseInt(sizeTitle)<44) ? parseInt(sizeTitle) + 2 : 44 ;
            localStorage.setItem('fontSizeTitle', newSizeTitle + 'px');
        }
        else{
            localStorage.setItem('fontSizeTitle', 32 + 'px');
        }
    }

    applyFontSize();
}


function decreaseFontSize() {
    var element = document.getElementById("valueFontSize");
    var size = window.getComputedStyle(element, null).getPropertyValue("font-size");
    console.log(size)
    var newSize = (parseInt(size)>10) ? parseInt(size) - 2 : 10 ;
    localStorage.setItem('fontSize', newSize + 'px');

    var elementTitle = document.querySelector('.main-title');
    if(elementTitle){
        var sizeTitle = window.getComputedStyle(elementTitle, null).getPropertyValue("font-size");
        var newSizeTitle = (parseInt(sizeTitle)>24) ? parseInt(sizeTitle) - 2 : 24 ;
        localStorage.setItem('fontSizeTitle', newSizeTitle + 'px');
    }
    else{
        if(localStorage.getItem('fontSizeTitle')){
            var sizeTitle = localStorage.getItem('fontSizeTitle');
            var newSizeTitle = (parseInt(sizeTitle)>24) ? parseInt(sizeTitle) - 2 : 24 ;
            localStorage.setItem('fontSizeTitle', newSizeTitle + 'px');
        }
        else{
            localStorage.setItem('fontSizeTitle', 28 + 'px');
        }
    }

    applyFontSize();
}

function applyFontSize() {

    var elementContent = document.querySelector('.main-content')
    if (elementContent) {

      var size = localStorage.getItem('fontSize');

      elementContent.style.fontSize = size;
    }
    
    var elementNav = document.querySelector('.nav-primary')
    if (elementNav) {

      var sizeNav = localStorage.getItem('fontSize');

      elementNav.style.fontSize = sizeNav;
    }

    var elementTitle = document.querySelector('.main-title');
    if(elementTitle){
        if(localStorage.getItem('fontSizeTitle')){
            var sizeTitle = localStorage.getItem('fontSizeTitle');

            elementTitle.style.fontSize = sizeTitle;
        }
    }
}

function clearLocalStorage (){
    localStorage.clear();
    location.reload();
}

function displayFlashMessage(message) {
    const flashMessage = document.querySelector('.flash-message');
    flashMessage.textContent = message;
    flashMessage.classList.add('show');

    setTimeout(function() {
        flashMessage.classList.remove('show')
    }, 2000);
}

async function submitForm() {
    const formData = new FormData(document.querySelector('form'));

    var object = {};
    formData.forEach(function(value, key) {
        object[key] = value;
    })
    var formJSON = JSON.stringify(object)

    if (window.location.pathname == '/risk-classification' || window.location.pathname == '/record-queue') {
        const backdrop = document.getElementsByClassName('modal-backdrop')[0]
        backdrop.classList.remove('modal-backdrop')

        const modals = [...document.getElementsByClassName('modal')];
        modals.forEach(function(modal) {
            modal.style.display = 'none';
        });
    }
    const domain = window.location.protocol + '//' + window.location.host; 
    const route = (window.location.pathname == '/risk-classification' || window.location.pathname == '/record-queue') ? domain + "/remove-record" : window.location.href; 

    const response = await fetch(route, {
        method: 'POST',
        body: formJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (response.ok) {
        const jsonResponse = await response.json();

        if (jsonResponse.message) {
            if (jsonResponse.message != '') {
                displayFlashMessage(jsonResponse.message);

            }

            if (jsonResponse.redirect) {
                setTimeout(function() {
                    window.location.href = jsonResponse.redirect;
                }, 1000);
            }

        } else {
            window.location.href = '/';
        }
    } else {
        console.error('Erro ao submeter formulário!')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.onload = applyThemeBasedOnRoute()
    window.onload = applyFontSize()

    if (typeof document.getElementsByClassName('dropbtn')[0] !== 'undefined') {
        var dropdownBtn = document.getElementsByClassName('dropbtn')[0];
        dropdownBtn.addEventListener('click', function() {
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display == 'block') {
                dropdownContent.style.display = 'none';
            } else {
                dropdownContent.style.display = 'block';
            }
        });
    }

    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            submitForm();
        });
    });
})
