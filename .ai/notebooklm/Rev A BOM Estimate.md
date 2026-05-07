# Rev A BOM Estimate

This is a spreadsheet-style purchasing guide for a **rev-A prototype** of the NFC music controller. Prices are estimated in **USD** for low-quantity hobbyist sourcing and should be treated as planning numbers, not quotes.

## Assumptions

- Goal: prove wake/sleep behavior, NFC one-shot reads, Home Assistant routing, basic enclosure fit, and dock charging viability.
- Bias: prefer lower-risk, easier-to-source parts for rev A.
- Default architecture: **ESP32-S3-first** unless later research strongly justifies ESP32-P4.

## Core electronics

| Category | Part | Qty | Unit Cost | Extended Cost | Rev | Notes |
| --- | --- | ---: | ---: | ---: | --- | --- |
| MCU | ESP32-S3 dev board/module | 1 | 12.00 | 12.00 | A | Safer bring-up path than P4 for early prototyping |
| NFC | PN532 module | 1 | 14.00 | 14.00 | A | Use insertion-triggered read window rather than continuous polling |
| Presence sensing | Card detect switch / interrupter | 1 | 2.50 | 2.50 | A | Critical for one-shot read logic |
| PIR | AM312 sensor | 1 | 2.50 | 2.50 | A | Wake-only front end |
| Bump sensor | Vibration switch | 1 | 1.50 | 1.50 | A | Cheap first-pass motion wake trigger |
| ePaper | 2.13" or 2.9" SPI ePaper | 1 | 18.00 | 18.00 | A | Static label/status display under slot |
| Main display | Small TFT LCD module | 1 | 28.00 | 28.00 | A | Pick a readily supported module first, not the fanciest one |
| Button hardware | 5 sealed small buttons | 5 | 2.50 | 12.50 | A | Left/right/select/vol+/vol- |
| Big Red Skip | Large sealed button | 1 | 6.00 | 6.00 | A | Separate line item because ergonomics matter |
| Audio | Piezo buzzer | 1 | 1.50 | 1.50 | A | UI chirps only |
| Lighting | RGB/mono LEDs + resistors | 1 set | 3.00 | 3.00 | A | Keep low power |
| I/O expansion | GPIO expander | 1 | 2.50 | 2.50 | A | Frees pins for display and wake routing |
| Interrupt aggregation | Diodes / small logic parts | 1 set | 2.00 | 2.00 | A | For shared wake/interrupt net if needed |

**Core electronics subtotal:** **$106.00**

## Power and charging

| Category | Part | Qty | Unit Cost | Extended Cost | Rev | Notes |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Battery | 18650 cell or flat LiPo | 1 | 8.00 | 8.00 | A | Choose based on enclosure volume |
| Protection / PMIC | Charger or power-path module | 1 | 5.00 | 5.00 | A | Favor low quiescent current |
| Qi receiver | 5W or 10W Qi receiver module | 1 | 8.00 | 8.00 | A | Validate thermal and coupling behavior |
| Regulators / power parts | Misc. regulators, caps, wiring | 1 set | 6.00 | 6.00 | A | Cushion for early integration work |
| USB debug / charging access | Temporary breakout or port parts | 1 set | 3.00 | 3.00 | A | Helpful before full dock-only charging is trusted |

**Power subsystem subtotal:** **$30.00**

## Mechanical and enclosure materials

| Category | Part | Qty | Unit Cost | Extended Cost | Rev | Notes |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Magnets | Dock alignment magnet set | 1 set | 8.00 | 8.00 | A | Keep outside NFC and Qi critical zones |
| Gasket material | Silicone cord / foam / TPU seal | 1 set | 5.00 | 5.00 | A | Needed for splash resistance |
| Fasteners | Screws, washers, inserts | 1 set | 6.00 | 6.00 | A | Heat-set inserts preferred |
| Print material | PETG/ASA prototype filament allocation | 1 lot | 12.00 | 12.00 | A | Includes failed-print tax |
| Window/lens material | Clear insert / adhesive sheet | 1 set | 5.00 | 5.00 | A | For display protection |
| Wire / connectors | JSTs, jumpers, harness parts | 1 set | 8.00 | 8.00 | A | Prototype-friendly wiring overhead |

**Mechanical subtotal:** **$44.00**

## Optional rev-B or high-risk upgrade items

| Category | Part | Qty | Unit Cost | Extended Cost | Rev | Why it can wait |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Advanced MCU path | ESP32-P4 module/dev board | 1 | 20.00 | 20.00 | B | Better deferred until software/display support is proven |
| Better motion sensing | Accelerometer module | 1 | 5.00 | 5.00 | B | Add after simple bump switch behavior is characterized |
| Premium display path | Higher-end display or touch stack | 1 | 35.00 | 35.00 | B | High risk for power and integration complexity |
| Better acoustics | Amplified audio or richer buzzer circuit | 1 | 6.00 | 6.00 | B | Not essential for functional proof |

**Optional rev-B subtotal:** **$66.00**

## Estimated totals

- **Rev-A working prototype target:** **$180.00**
- **Rev-A realistic range with sourcing variance:** **$160-$220**
- **If rev-B options are added immediately:** roughly **$226-$286**

## Must-buy now

- ESP32-S3 dev hardware
- PN532 module
- card presence sensor
- PIR sensor
- bump/vibration sensor
- primary display
- SPI ePaper display
- button hardware
- battery + charging path parts
- Qi receiver
- magnets
- gasket / enclosure hardware

## Good candidates to defer

- ESP32-P4 hardware
- accelerometer upgrade
- premium display upgrade
- richer audio feedback hardware

## Biggest BOM volatility risks

1. **Display choice** — can swing both cost and integration complexity sharply.
2. **Battery + enclosure geometry** — packaging may force a different cell choice.
3. **Qi + magnet arrangement** — docking hardware may need multiple iterations.
4. **Sealed button selection** — real mechanical feel often changes after the first print.
