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
for (var i = 0; i <= 100; i++) {

    var option = document.createElement("option");
    option.text = i;
    option.value = i;

    select.appendChild(option);
}


var html5Slider = document.getElementById('html5');

noUiSlider.create(html5Slider, {
    start: [0, 100],
    connect: true,
    range: {
        'min': 0,
        'max': 100
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
    var i, window, buttons;
    window = document.querySelectorAll(".window");
    for (i = 0; i < window.length; i++) {
        window[i].style.display = "none";
    }
    buttons = document.querySelectorAll(".inner_row button");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }
    document.getElementById(type).style.display = "block";
    evt.currentTarget.className += " active";
}

document.querySelector("#defaultOpen").click();