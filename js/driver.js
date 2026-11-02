/* Driver page: turns a phone number into a rider link and QR code. */
(function () {
    "use strict";

    // Returns digits with country code, or null if the number looks invalid.
    function normalize(raw) {
        var d = raw.replace(/\D/g, "");
        if (d.length === 10) return "1" + d;            // US number without country code
        if (d.length >= 11 && d.length <= 15) return d; // already has a country code
        return null;
    }

    function showError(msg) {
        $("err").textContent = msg;
        $("err").hidden = !msg;
    }

    $("f").addEventListener("submit", function (e) {
        e.preventDefault();
        showError("");

        const driver = normalize($("phone").value);
        if (!driver) {
            showError("Enter a 10-digit phone number, or include the country code.");
            $("phone").focus();
            return;
        }
        if (typeof QRCode === "undefined") {
            showError("The QR code library didn’t load. Check your connection and try again.");
            return;
        }

        var name = $("name").value.trim().slice(0, 30);

        // The rider page lives at ./ride/ relative to this page.
        var url = new URL("ride/", location.href);
        url.searchParams.set("driver", driver);
        if (name) url.searchParams.set("name", name);

        $("qr").innerHTML = "";
        new QRCode($("qr"), {
            text: url.href,
            width: 288,
            height: 288,
            colorDark: "#1B1F3B",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        $("link").value = url.href;
        $("preview").href = url.href;
        $("outSub").textContent = "Riders scan this to request a ride from " + (name || "you") + ".";
        $("out").hidden = false;
        $("out").scrollIntoView({behavior: "smooth", block: "start"});
    });

    $("copy").addEventListener("click", function () {
        copyText($("link").value, this, "Copy link");
    });

    // Save the QR as a PNG with a white margin so it scans reliably when printed.
    $("dl").addEventListener("click", function () {
        const src = $("qr").querySelector("canvas");
        if (!src) return;
        const pad = 40;
        const c = document.createElement("canvas");
        c.width = c.height = src.width + pad * 2;
        const g = c.getContext("2d");
        g.fillStyle = "#fff";
        g.fillRect(0, 0, c.width, c.height);
        g.drawImage(src, pad, pad);
        const a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = "ride-request-qr.png";
        a.click();
    });
})();