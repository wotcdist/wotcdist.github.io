import '@themesberg/flowbite/dist/flowbite.min.css';
import '@themesberg/flowbite'; 
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/animations/scale.css';
import { createPopper } from '@popperjs/core';
import { Datepicker, DateRangePicker } from '@themesberg/tailwind-datepicker';

// Toggle target elements using [data-collapse-toggle]
document.querySelectorAll('[data-collapse-toggle]').forEach(function (collapseToggleEl) {
    var collapseId = collapseToggleEl.getAttribute('data-collapse-toggle');
    var collapseEl = document.getElementById(collapseId);

    collapseToggleEl.addEventListener('click', function() {
        if (collapseEl.classList.contains("hidden")) {
            collapseEl.classList.remove("hidden");
        } else {
            collapseEl.classList.add("hidden");
        }
    });
});

// Toggle dropdown elements using [data-dropdown-toggle]
document.querySelectorAll('[data-dropdown-toggle]').forEach(function (dropdownToggleEl) {
    var dropdownMenuId = dropdownToggleEl.getAttribute('data-dropdown-toggle');
    var dropdownMenuEl = document.getElementById(dropdownMenuId);

    dropdownToggleEl.addEventListener('click', function (event) {
        var element = event.target;
        while (element.nodeName !== "BUTTON") {
            element = element.parentNode;
        }
        createPopper(element, dropdownMenuEl, {
            placement: 'bottom-start',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 10],
                    },
                },
            ]
        });

        // toggle when click on the button
        dropdownMenuEl.classList.toggle("hidden");
        dropdownMenuEl.classList.toggle("block");

        function handleDropdownOutsideClick(event) {
            var targetElement = event.target; // clicked element
            if (targetElement !== dropdownMenuEl && targetElement !== dropdownToggleEl && !dropdownToggleEl.contains(targetElement)) {
                dropdownMenuEl.classList.add("hidden");
                dropdownMenuEl.classList.remove("block");
                document.body.removeEventListener('click', handleDropdownOutsideClick, true);
            }
        }

        // hide popper when clicking outside the element
        document.body.addEventListener('click', handleDropdownOutsideClick, true);
    });
});

document.querySelectorAll('[data-modal-toggle]').forEach(function (modalToggleEl) {
    var modalId = modalToggleEl.getAttribute('data-modal-toggle');
    var modalEl = document.getElementById(modalId);

    modalToggleEl.addEventListener('click', function() {
        modalEl.classList.toggle("hidden");
        document.getElementById(modalId + "-backdrop").classList.toggle("hidden");
        modalEl.classList.toggle("flex");
        document.getElementById(modalId + "-backdrop").classList.toggle("flex");

        function handleModalOutsideClick(event) {
            var targetElement = event.target; // clicked element
            if (targetElement !== modalEl && !modalEl.contains(targetElement)) {
                modalEl.classList.add("hidden");
                document.getElementById(modalId + "-backdrop").classList.add("hidden");
                modalEl.classList.remove("flex");
                document.getElementById(modalId + "-backdrop").classList.remove("flex");
                document.body.removeEventListener('click', handleModalOutsideClick, true);
            }
        }

        // hide popper when clicking outside the element
        document.body.addEventListener('click', handleModalOutsideClick, true);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    tippy('[data-tippy-content]');
});

const getDatepickerOptions = (datepickerEl) => {

    const buttons = datepickerEl.hasAttribute('datepicker-buttons');
    const autohide = datepickerEl.hasAttribute('datepicker-autohide');
    const format = datepickerEl.hasAttribute('datepicker-format');
    const orientation = datepickerEl.hasAttribute('datepicker-orientation');
    const title = datepickerEl.hasAttribute('datepicker-title');

    let options = {};
    if (buttons) {
        options.todayBtn = true;
        options.clearBtn = true;
    }
    if (autohide) {
        options.autohide = true;
    }
    if (format) {
        options.format = datepickerEl.getAttribute('datepicker-format');
    }
    if (orientation) {
        options.orientation = datepickerEl.getAttribute('datepicker-orientation');
    }
    if (title) {
        options.title = datepickerEl.getAttribute('datepicker-title');
    }

    return options;
}

document.querySelectorAll('[datepicker]').forEach(function (datepickerEl) {
    new Datepicker(datepickerEl, getDatepickerOptions(datepickerEl));
});

document.querySelectorAll('[inline-datepicker]').forEach(function (datepickerEl) {
    new Datepicker(datepickerEl, getDatepickerOptions(datepickerEl));
});

document.querySelectorAll('[date-rangepicker]').forEach(function (datepickerEl) {
    new DateRangePicker(datepickerEl, getDatepickerOptions(datepickerEl));
});
