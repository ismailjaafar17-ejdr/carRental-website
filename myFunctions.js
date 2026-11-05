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

    function parseDate(value) {
        var match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
        if (!match) {
            return null;
        }

        var day = Number(match[1]);
        var month = Number(match[2]);
        var year = Number(match[3]);
        var date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }

        return date;
    }

    function getBookingSummary(startDate, endDate) {
        var days = Math.round((endDate - startDate) / 86400000);
        var total = 0;
        var carLines = [];

        $(".select-car:checked").each(function () {
            var price = Number($(this).data("price"));
            var carTotal = price * days;
            total += carTotal;
            carLines.push($(this).data("name") + ": " + days + " يوم - " + carTotal.toLocaleString("en-US") + " ل.س");
        });

        if (days > 7) {
            total *= 0.9;
        }

        return "تم التحقق من الطلب بنجاح.\nالسيارات المختارة:\n" +
            carLines.join("\n") +
            "\nالمجموع الإجمالي بعد الخصم: " + total.toLocaleString("en-US") + " ل.س" +
            (days > 7 ? "\n(تم تطبيق خصم 10% لأن مدة التأجير تتجاوز 7 أيام.)" : "");
    }

    $(function () {
        $(".show-details").on("change", function () {
            var $details = $(this).closest("tr").next(".details");
            $details.stop(true, true)[this.checked ? "slideDown" : "slideUp"](250);
        });

        $(".select-car").on("change", function () {
            $(this).closest("tr").toggleClass("selected-car", this.checked);
            $("#continue-booking").prop("disabled", $(".select-car:checked").length === 0);
        });

        $("#continue-booking").on("click", function () {
            if ($(".select-car:checked").length === 0) {
                return;
            }

            $(".pageform").prop("hidden", false).hide().slideDown(300);
            $(".pageform")[0].scrollIntoView({ behavior: "smooth", block: "start" });
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

            if (!nationalNumber || !startDate || !endDate || !selectedCars) {
                showMessage($form, "يرجى إدخال الرقم الوطني وتاريخي التأجير واختيار سيارة واحدة على الأقل.", "error");
                return;
            }

            if (fullName && !/^[\u0621-\u064A]+(?:\s+[\u0621-\u064A]+)*$/.test(fullName)) {
                showMessage($form, "الاسم يجب أن يحتوي على أحرف عربية ومسافات فقط.", "error");
                return;
            }

            if (!/^(0[1-9]|1[0-4])\d{9}$/.test(nationalNumber)) {
                showMessage($form, "الرقم الوطني يجب أن يتكون من 11 خانة وأن يبدأ برمز محافظة من 01 إلى 14.", "error");
                return;
            }

            var start = parseDate(startDate);
            var end = parseDate(endDate);
            if (!start || !end || end <= start) {
                showMessage($form, "يجب إدخال التاريخين بصيغة dd-mm-yyyy، ويجب أن يكون تاريخ النهاية لاحقاً للبداية.", "error");
                return;
            }

            if (mobileNumber && !/^09(3|4|5|6|8|9)\d{7}$/.test(mobileNumber)) {
                showMessage($form, "رقم الموبايل يجب أن يكون رقماً سورياً صحيحاً من 10 خانات لشبكتي Syriatel أو MTN.", "error");
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage($form, "يرجى إدخال بريد إلكتروني صحيح.", "error");
                return;
            }

            showMessage($form, getBookingSummary(start, end), "success");
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
