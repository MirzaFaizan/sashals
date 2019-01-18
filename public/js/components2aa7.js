"use strict";

(function ($, document) {
    var documentScrollPosition = 0;

    var classes = {
        component: "transition-warning",
        link: "transition-warning__link",
        continue: "transition-warning__continue-button",
        cancel: "transition-warning__cancel-button"
    };

    addEventHandlers();

    function addEventHandlers() {
        var $component = $("." + classes.component);
        var $continueButton = $("." + classes.continue);
        var $cancelButton = $("." + classes.cancel);

        $component.on("show.bs.modal", handleDialogShow);
        $component.on("shown.bs.modal", handleDialogShown);

        $component.on("hide.bs.modal", handleDialogHide);

        $continueButton.on("click", handleContinueButtonClick);
        $cancelButton.on("click", handleCancelButtonClick);
    }

    function handleDialogShow() {
        var url = $("." + classes.component).attr("data-url");

        $("." + classes.link).text(url);
    }

    function handleDialogShown() {
        documentScrollPosition = $(document).scrollTop();

        $("body").css("position", "fixed");
    }

    function handleDialogHide() {
        $("." + classes.component).find(".modal-content").get(0).scrollTop = 0;

        $("body").css("position", "static");

        $(document).scrollTop(documentScrollPosition);
    }

    function handleContinueButtonClick() {
        var url = $("." + classes.component).attr("data-url");

        $("." + classes.component).modal("hide");

        setTimeout(function () {
            window.open(url);
        }, 200);
    }

    function handleCancelButtonClick() {
        $("." + classes.component).modal("hide");
    }
})(jQuery, document);
"use strict";

(function ($, document, window) {

    addEventHandlers();

    function addEventHandlers() {
        $(document).on("change", ".date-range-type input", handleDateRangeTypeChange);
    }

    function handleDateRangeTypeChange() {
        $(".date-range-type label").removeClass("active");
        $(this).parent().addClass("active");
    }
})(jQuery, document, window);
"use strict";

(function ($, document, window) {

    var dropdownVisible = false;

    addEventHandlers();

    function addEventHandlers() {
        $(document).on("click", handleDocumentClick);
        $(document).on("click", ".search-row__selector-button", handleSelectorButtonClick);
        $(document).on("click", ".search-row__dropdown-button", handleDropdownButtonClick);
    }

    function handleDocumentClick(e) {
        dropdownVisible = false;
        toggleDropdownVisibility();
    }

    function handleSelectorButtonClick(e) {
        e.stopPropagation();

        dropdownVisible = !dropdownVisible;
        toggleDropdownVisibility();
    }

    function handleDropdownButtonClick(e) {
        e.stopPropagation();

        var url = $(this).data("url");
        $(".search-row__form").attr("action", url);

        var option = $(this).data("option");
        if (option === "services") {
            $(".search-row__selector-button-text").text(php_in_service);
        }

        if (option === "requests") {
            $(".search-row__selector-button-text").text(php_in_request);
        }

        dropdownVisible = false;
        toggleDropdownVisibility();
    }

    function toggleDropdownVisibility() {
        if (dropdownVisible) {
            $(".search-row__dropdown").fadeIn(150);
            $(".search-row").addClass("search-row--open");

            return;
        }

        $(".search-row__dropdown").fadeOut(150);
        $(".search-row").removeClass("search-row--open");
    }
})(jQuery, document, window);
"use strict";

(function ($, document, window) {
    var classes = {
        component: "service-request-card",
        tagContainer: "service-request-card__tags"
    };

    var documentWidth = $(document).width();

    if (documentWidth < 1100) {
        $("." + classes.tagContainer).removeClass("dragscroll").css("overflow-x", "scroll");
    }
})(jQuery, document, window);
"use strict";

(function ($, document, window) {
    var classes = {
        component: "service-request-view",
        tagContainer: "service-request-view__tags"
    };

    var documentWidth = $(document).width();

    if (documentWidth < 1100) {
        $("." + classes.tagContainer).removeClass("dragscroll").css("overflow-x", "scroll");
    }
})(jQuery, document, window);
"use strict";

(function ($, document) {
    var classes = {
        component: "user-profile-delete",
        warning: "user-profile-delete__warning",
        deleteButton: "user-profile-delete__button",
        acceptButton: "user-profile-delete__accept",
        cancelButton: "user-profile-delete__cancel"
    };

    addEventHandlers();

    function addEventHandlers() {
        $(document).on("click", "." + classes.deleteButton, handleDeleteButtonClick);
        $(document).on("click", "." + classes.cancelButton, handleCancelButtonClick);
    }

    function handleDeleteButtonClick() {
        showWarning();
    }

    function handleCancelButtonClick() {
        var $warning = $("." + classes.warning);

        $warning.slideUp();
    }

    function showWarning() {
        var $warning = $("." + classes.warning);
        var $userProfileEditDialog = $("#editprofile_modal");

        $warning.slideDown(function () {
            $userProfileEditDialog.animate({
                scrollTop: $warning.offset().top
            }, 300);
        });
    }
})(jQuery, document);
"use strict";

(function ($, document, window) {
    var classes = {
        component: "service-links",
        link: "service-links__link",
        warning: "transition-warning"
    };

    addEventHandlers();

    function addEventHandlers() {
        $(document).on("click", "." + classes.link, handleServiceLinkClick);
    }

    function handleServiceLinkClick(e) {
        e.preventDefault();

        var url = $(this).attr("href");

        $("." + classes.warning).attr("data-url", url).modal();
    }
})(jQuery, document, window);
"use strict";

(function ($, document) {
    var classes = {
        component: "user-profile-edit-phone",
        removeButton: "user-profile-edit-phone__remove-button",
        addButton: "user-profile-edit-phone__add-button",
        input: "user-profile-edit-phone__input"
    };

    addEventHandlers();

    function addEventHandlers() {
        $(document).on("click", "." + classes.addButton, handleAddButtonClick);
        $(document).on("click", "." + classes.removeButton, handleRemoveButtonClick);
    }

    function handleAddButtonClick() {
        var $component = findComponentContainer($(this));

        var $newComponent = $component.clone();
        var $newComponentInput = findComponentInput($newComponent);

        $newComponent.insertAfter($component).hide().slideDown(100);
        $newComponent.removeClass(classes.component + "--main");

        $newComponentInput.attr("name", "User[phones][]").val("").focus();
        $newComponentInput.inputmask({ mask: $newComponentInput.data("mask") });
    }

    function handleRemoveButtonClick(e) {
        var $component = findComponentContainer($(this));

        $component.slideUp(100, function () {
            $component.remove();
        });
    }

    function findComponentContainer($element) {
        return $element.parent("." + classes.component);
    }

    function findComponentInput($element) {
        return $element.find("." + classes.input);
    }
})(jQuery, document);