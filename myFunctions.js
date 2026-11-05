(function ($) {
    "use strict";

    if (!$) {
        console.error("jQuery is required for the car rental pages.");
        return;
    }

    function showMessage($form, message, type) {
        var $message = $form.find(".form-message");
        if (!$message.length) {
            $message = $('<div class="form-message" role="alert"></div>');
            $form.prepend($message);
        }
        $message.removeClass("error success").addClass(type).text(message);
    }

    $(function () {
        $(".show-details").on("change", function () {
            var $details = $(this).closest("tr").next(".details");
            $details.stop(true, true)[this.checked ? "slideDown" : "slideUp"](250);
        });

        $(".select-car").on("change", function () {
            $(this).closest("tr").toggleClass("selected-car", this.checked);
        });

        $(".pageform form").on("submit", function (event) {
            event.preventDefault();

            var $form = $(this);
            var fullName = $.trim($("#FullName").val());
            var nationalNumber = $.trim($("#NationalNumber").val());
            var startDate = $("#StartDate").val();
            var endDate = $("#EndDate").val();
            var mobileNumber = $.trim($("#MobileNumber").val());
            var email = $.trim($("#Email").val());
            var selectedCars = $(".select-car:checked").length;

            if (!fullName || !nationalNumber || !startDate || !endDate || !mobileNumber || !email || !selectedCars) {
                showMessage($form, "يرجى تعبئة جميع الحقول واختيار سيارة واحدة على الأقل.", "error");
                return;
            }

            if (!/^(0[1-9]|1[0-4])\d{4,}$/.test(nationalNumber) || !/^\d{7,15}$/.test(mobileNumber)) {
                showMessage($form, "يرجى إدخال رقم وطني يبدأ برمز محافظة من 01 إلى 14، ورقم موبايل صحيح.", "error");
                return;
            }

            if (new Date(endDate) <= new Date(startDate)) {
                showMessage($form, "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء.", "error");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage($form, "يرجى إدخال بريد إلكتروني صحيح.", "error");
                return;
            }

            showMessage($form, "تم إرسال طلب الحجز بنجاح. سنتواصل معك قريباً.", "success");
        });

        $(".pageform form").on("reset", function () {
            var $form = $(this);
            window.setTimeout(function () {
                $form.find(".form-message").remove();
                $(".select-car").closest("tr").removeClass("selected-car");
            }, 0);
        });
    });
}(window.jQuery));
