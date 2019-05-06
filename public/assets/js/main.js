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