# Ride coordinator

A static site for coordinating rides with a sober driver. Riders scan a QR code,
fill in a short form, and their phone opens a pre-written text to the driver.

## Structure

```
/
├── index.html        Driver page: enter a number, get a link and QR code
├── ride/
│   └── index.html    Rider page: served at /ride/?driver=15185551234&name=Mike
├── css/
│   └── styles.css    Shared styles for both pages
└── js/
    ├── common.js     Shared helpers ($, copyText)
    ├── driver.js     Driver page logic and QR generation
    └── ride.js       Rider page logic and sms: link builder
```

## Notes

- Texts are sent from the rider's own phone, so no backend or API keys are needed.
- The QR code image is generated in the browser by qrcodejs, loaded from cdnjs.
