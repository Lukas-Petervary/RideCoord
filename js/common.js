/* Helpers shared by the driver page and the rider page. Load this first. */

function $(id) {
  return document.getElementById(id);
}

/**
 * Copy text to the clipboard and briefly change the button label to "Copied".
 * Falls back to a hidden textarea where the Clipboard API isn't available.
 */
function copyText(text, button, idleLabel) {
  function done() {
    button.textContent = "Copied";
    setTimeout(function () { button.textContent = idleLabel; }, 1800);
  }
  function fallback() {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { if (document.execCommand("copy")) done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, fallback);
  } else {
    fallback();
  }
}
