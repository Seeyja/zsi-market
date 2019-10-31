/********************UPLOAD FILE*********************/

'use strict';

;
(function (document, window, index) {
    var inputs = document.querySelectorAll('#file');
    Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener('change', function (e) {
            var fileName = '';
            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            else
                fileName = e.target.value.split('\\').pop();

            if (fileName)
                label.querySelector('span').innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });

        // Firefox bug fix
        input.addEventListener('focus', function () {
            input.classList.add('has-focus');
        });
        input.addEventListener('blur', function () {
            input.classList.remove('has-focus');
        });
    });
}(document, window, 0));

/********************CHECKBOX *********************/

document.addEventListener("DOMContentLoaded", function () {
    var q = document.querySelectorAll(".items_checkbox");
    for (var i in q) {
        if (+i < q.length) {
            q[i].addEventListener("click", function () {
                let c = this.classList,
                    p = "animationfix";
                if (c.contains(p)) {
                    c.remove(p);
                }
            });
        }
    }
});

/*********** Active category***********/

const categories = document.querySelectorAll(".category img");

categories.forEach(function (category) {
    category.addEventListener('click', activeCategory);
})

function activeCategory() {
    this.classList.toggle("active");
}

/*****Price range ***************/

var select = document.getElementById('input-select');

// Append the option elements
for (var i = 0; i <= 60; i++) {

    var option = document.createElement("option");
    option.text = i;
    option.value = i;

    select.appendChild(option);
}

var html5Slider = document.getElementById('html5');

noUiSlider.create(html5Slider, {
    start: [0, 60],
    connect: true,
    range: {
        'min': 0,
        'max': 60
    }
});

var inputNumber = document.getElementById('input-number');

html5Slider.noUiSlider.on('update', function (values, handle) {

    var value = values[handle];

    if (handle) {
        inputNumber.value = Math.round(value);
    } else {
        select.value = Math.round(value);
    }
});

select.addEventListener('change', function () {
    html5Slider.noUiSlider.set([this.value, null]);
});

inputNumber.addEventListener('change', function () {
    html5Slider.noUiSlider.set([null, this.value]);
});




/**  BOOKS BUTTONS */

function openWindow(evt, type) {

    evt.currentTarget.className += " active";
    const $book = (evt.target).closest("article");
    const $currentBook = $($book).attr('id');

    var i, window, buttons;
    window = document.querySelectorAll("#" + $currentBook + " .window");
    for (i = 0; i < window.length; i++) {
        window[i].style.display = "none";
    }
    buttons = document.querySelectorAll("#" + $currentBook + " .inner_row button");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }
    document.querySelector("#" + $currentBook + ' #' + type).style.display = "block";
    evt.currentTarget.className = " active";

}
document.querySelectorAll("#defaultOpen").forEach(function (open) {
    open.click();
})


/* CONTACT CHOICE*/

// const button = document.querySelector(".add_book button[type=submit]");

// const tel = document.querySelector(".add_book input[type=tel]");
// const email = document.querySelector(".add_book input[type=email]");

// const validate = () => {

//     if (tel.value !== "" || email.value !== "") {
//         email.removeAttribute("required");
//         tel.removeAttribute("required");
//     } else {
//         tel.setAttribute("required", "required");
//         email.setAttribute("required", "required");
//     }
// }

// button.addEventListener("click", validate);




function closeValuationWindow() {
    location.href = "http://sellfast.pl/";
    jQuery("#valuation_window").fadeOut('fast');
}

function closeValuationWindow2() {
    jQuery("#valuation_window2").fadeOut('fast');
}

function closeValuationWindow3() {
    location.href = "http://sellfast.pl/";
    jQuery("#valuation_window3").fadeOut('fast');
}

function showValuationWindow(header, content) {
    document.querySelector("#offer_details2 h5").innerHTML = header;
    document.querySelector("#offer_details2 p").innerHTML = unEntity(content);
    jQuery("#valuation_window").fadeIn('fast');
}

function showValuationWindow2(header, content) {
    document.querySelector("#offer_details3 h5").innerHTML = header;
    document.querySelector("#offer_details3 p").innerHTML = unEntity(content);
    jQuery("#valuation_window2").fadeIn('fast');
}

function showValuationWindow3(header, content) {
    document.querySelector("#offer_details4 h5").innerHTML = header;
    document.querySelector("#offer_details4 p").innerHTML = unEntity(content);
    jQuery("#valuation_window3").fadeIn('fast');
}

// Zamiana &lt na < i &gt na >
function unEntity(str) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

const validateForm = () => {

    const errorMessage = document.querySelector(".add_book span.validate");
    const errorImage = `<img src="img/exclamation-mark.png">`;


    let loginInputValue = document.forms["mainForm"]["login"].value;
    let passwordInputValue = document.forms["mainForm"]["password"].value;
    let classInputValue = document.forms["mainForm"]["class"].value;
    let telInputValue = document.forms["mainForm"]["num"].value;
    let emailInputValue = document.forms["mainForm"]["email"].value;
    let textareaInputValue = document.forms["mainForm"]["description"].value.replace(/[\r\n]+/gm, "");
    document.forms["mainForm"]["description"].value = textareaInputValue;
    const checkboxChecked = $("input[type=checkbox]:checked").length;

    const ruleLogin = /^[0-9a-zA-Z]+$/;
    const rulePhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
    const ruleEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!loginInputValue.match(ruleLogin)) {
        errorMessage.innerHTML = `${errorImage}Wprowadź tylko znaki alfanumeryczne!`;
        document.forms["mainForm"]["login"].focus();
        return false;
    } else if (loginInputValue.length > 15) {
        errorMessage.innerHTML = `${errorImage}Maksymalna długość nazwy użytkownika to 15 znaków!`;
        document.forms["mainForm"]["login"].focus();
        return false;
    } else if ((passwordInputValue.indexOf(' ') !== -1 || passwordInputValue == "") && document.forms["mainForm"]["password"].disabled == false) {
        document.forms["mainForm"]["password"].value = "";
        errorMessage.innerHTML = `${errorImage}Wypełnij pole z hasłem! Nie może zawierać spacji!`;
        document.forms["mainForm"]["password"].focus();
        return false;
    } else if (classInputValue == "") {
        document.forms["mainForm"]["class"].required = true;
        errorMessage.innerHTML = `${errorImage}Wybierz klasę!`;
        document.forms["mainForm"]["class"].focus();
        return false;
    } else if (!telInputValue.match(rulePhone) || telInputValue == "") {
        errorMessage.innerHTML = `${errorImage}Podaj numer w poprawnym formacie!`;
        document.forms["mainForm"]["num"].focus();
        return false;
    } else if (!emailInputValue.match(ruleEmail) && telInputValue == "") {
        errorMessage.innerHTML = `${errorImage}Podaj adres email w poprawnym formacie!`;
        document.forms["mainForm"]["email"].focus();
        return false;
    } else if (textareaInputValue.length < 10) {
        errorMessage.innerHTML = `${errorImage}Wypełnij pole z opisem! Powinno zawierać minimum 10 znaków!`;
        document.forms["mainForm"]["description"].focus();
        return false;
    } else if (textareaInputValue.length > 150) {
        errorMessage.innerHTML = `${errorImage}Opis może zawierać maksymalnie 150 znaków!`;
        document.forms["mainForm"]["description"].focus();
        return false;
    } else if (!checkboxChecked) {
        errorMessage.innerHTML = `${errorImage}Proszę zaznaczyć przynajmniej jeden przedmiot!`;
        return false;
    }
}