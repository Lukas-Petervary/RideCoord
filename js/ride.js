/* Rider page: reads the driver from the URL and opens a pre-filled text. */
(function () {
    "use strict";

    const params = new URLSearchParams(location.search);
    const name = (params.get("name") || "").trim().slice(0, 30);
    let driver = (params.get("driver") || "").replace(/\D/g, "");
    if (driver.length === 10) driver = "1" + driver;

    if (driver.length < 11 || driver.length > 15) {
        $("bad").hidden = false;
        return;
    }
    $("good").hidden = false;

    function pretty(d) {
        const m = d.match(/^1(\d{3})(\d{3})(\d{4})$/);
        return m ? "(" + m[1] + ") " + m[2] + "-" + m[3] : "+" + d;
    }

    const driverLabel = pretty(driver);

    // textContent only: the name comes from the URL and must never be parsed as HTML.
    $("lede").textContent =
        (name ? name + " is your driver. " : "") +
        "Fill this in and your phone will open a text to " + driverLabel + ".";

    try {
        var saved = localStorage.getItem("ridePhone");
        if (saved) $("phone").value = saved;
    } catch (e) {}

    // People stepper (1 to 8)
    const count = $("count");

    function setCount(n) {
        count.value = Math.min(8, Math.max(1, n || 1));
    }

    $("minus").addEventListener("click", function () {
        setCount((parseInt(count.value, 10) || 1) - 1);
    });
    $("plus").addEventListener("click", function () {
        setCount((parseInt(count.value, 10) || 1) + 1);
    });

    function showError(msg) {
        $("err").textContent = msg;
        $("err").hidden = !msg;
    }

    // iOS wants "&body=", Android and most others want "?body=".
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    $("f").addEventListener("submit", function (e) {
        e.preventDefault();
        showError("");

        const phone = $("phone").value.trim();
        const dest = $("dest").value.trim();
        const n = parseInt(count.value, 10);

        if (phone.replace(/\D/g, "").length < 10) {
            showError("Enter a phone number the driver can reach.");
            $("phone").focus();
            return;
        }
        if (!dest) {
            showError("Tell the driver where you’re going.");
            $("dest").focus();
            return;
        }
        if (!(n >= 1 && n <= 8)) {
            showError("Choose between 1 and 8 people.");
            count.focus();
            return;
        }

        try {
            localStorage.setItem("ridePhone", phone);
        } catch (err) {}

        var msg = "Ride request: " + n + (n === 1 ? " person" : " people") +
            " going to " + dest + ". My number is " + phone + ".";
        var href = "sms:+" + driver + (isIOS ? "&" : "?") + "body=" + encodeURIComponent(msg);

        $("msgText").textContent = msg;
        $("sentSub").textContent =
            "If your messages app didn’t open, tap the button below, or copy this and text " + driverLabel + " yourself.";
        $("again").href = href;
        $("sent").hidden = false;
        location.href = href;
    });

    $("copy").addEventListener("click", function () {
        copyText($("msgText").textContent, this, "Copy message");
    });
})();
