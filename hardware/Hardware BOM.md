# Hardware BOM (Bill of Materials) - Integrated Strategy (Rev A)

To reduce cost and wiring complexity, this strategy uses an **integrated HMI (Human-Machine Interface) module** instead of discrete components. This reduces the total cost from ~$185 to **~$102**.

## Core Integrated Module

| Component | Est. Cost | Replaces | Links / Notes |
| :--- | :---: | :--- | :--- |
| **Waveshare ESP32-S3-Touch-LCD-3.5** | $31.00 | MCU, 3.5" Display, Charger, PMIC | [Waveshare Official](https://www.waveshare.com/esp32-s3-touch-lcd-3.5.htm) / [AliExpress](https://www.aliexpress.com/item/1005005968339683.html) |
| *Alternative: Sunton ESP32-S3 3.5" (CYD)* | *$24.00* | *Same as above* | *Lower build quality, slightly cheaper.* |

## Essential Peripherals

| Component | Qty | Est. Cost | Notes |
| :--- | :---: | :---: | :--- |
| **NFC:** PN532 V4 Module | 1 | $14.00 | Connect via I2C to module header. |
| **Qi Receiver:** 10W Module | 1 | $8.00 | Enables wireless docking. |
| **Battery:** 18650 Cell (3.7V Li-ion) | 1 | $8.00 | Plugs directly into module battery port. |
| **Big Red Skip:** 60-100mm Button | 1 | $6.00 | Ergonomic physical skip button. |
| **Magnets:** N52 Neodymium Rings | 1 set | $8.00 | For docking alignment. |
| **Sensors:** PIR, Vibration, Card Switch | 1 set | $6.50 | Wake and presence detection. |

## Cost Reduction Choices in this Strategy
1.  **Removed ePaper Display (-$18):** Use the top portion of the 3.5" LCD to display card/slot labels. This simplifies the enclosure and wiring.
2.  **Touch UI (-$12.50):** Use the capacitive touch screen for "Volume" and "Navigation" buttons instead of physical IP67 buttons.
3.  **Integrated PMIC:** The Waveshare board includes the battery charging and power management circuit (AXP2101).

## Enclosure & Mechanicals

| Item | Est. Cost | Notes |
| :--- | :---: | :--- |
| **Filament:** PETG/ASA (1kg) | $15.00 | Bulk/Budget filament. |
| **Fasteners & Gaskets** | $5.00 | Minimalist screw/seal set. |

---
**Total Estimated Prototype Cost (Integrated): ~$101.50**

## GPIO Mapping (Waveshare 3.5" S3)
- **I2C (IO17/18):** PN532 NFC Reader.
- **GPIO 1-5:** Big Red Button, Card Presence, PIR, Vibration.
- **Battery:** Uses onboard PH2.0/MX1.25 connector.
