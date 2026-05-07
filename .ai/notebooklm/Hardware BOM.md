# Hardware BOM for NotebookLM Source Pack

This document is intended as a NotebookLM source for the NFC music controller project. Prices are **small-quantity hobbyist estimates in USD** and should be treated as ballpark ranges, not quotes.

## Recommended prototype strategy

- **Prototype A (lower risk):** `ESP32-S3` main controller with integrated Wi-Fi/BLE, SPI ePaper, SPI/I2C peripherals, and a moderate-resolution RGB display path.
- **Prototype B (stretch goal):** `ESP32-P4` display-heavy architecture only if ESPHome support, display driver stability, and wireless co-processor strategy are verified by sources.

For early enclosure, wake/sleep, NFC, and Home Assistant integration work, the `ESP32-S3` path is the safer default.

## Core BOM

| Subsystem | Recommended Part | Approx. Cost (USD) | Pros | Cons / Risks | Integration Notes |
| --- | --- | ---: | --- | --- | --- |
| Main MCU | ESP32-S3 dev board or module | 8-18 | Mature ecosystem, Wi-Fi/BLE built in, strong ESPHome support | Less display bandwidth than a P4-centered design | Best first prototype choice; reserve RTC-capable pins for wake inputs |
| Optional advanced MCU path | ESP32-P4 module/dev board | 12-25 | Better display-oriented architecture, attractive for richer UI | Radio strategy and ESPHome maturity may add project risk | Treat as second-phase hardware unless sources confirm toolchain and ESPHome readiness |
| NFC reader | PN532 breakout/module | 10-20 | Common, well-documented, works over I2C/SPI/UART | Not the lowest power if left polling continuously | Gate reads on insertion/presence event; avoid continuous polling while card is parked |
| Card presence switch | Low-profile lever or optical interrupter | 1-4 | Lets firmware wake only on insert/remove activity | Mechanical alignment effort | Use to start/stop NFC polling and to create a deterministic one-shot read cycle |
| Primary display | 3.4-4.0" TFT LCD module | 18-40 | Better refresh than ePaper, practical for now-playing UI | Power draw is significant | Use aggressive timeout and power gating/backlight control |
| Secondary display | 2.13-2.9" SPI ePaper module | 12-25 | Holds image with near-zero static power | Slow refresh, partial-refresh artifacts possible | Best for static card/playlist labels beneath slot |
| PIR wake sensor | AM312 or similar low-power PIR | 1.50-4 | Extremely common, simple digital wake behavior | Limited directional control, can false-trigger | Use as a wake-only front-end, not a rich occupancy sensor |
| Bump / motion sensor | Vibration switch or LIS3DH-class accelerometer | 1-8 | Easy wake-on-motion path | Accelerometer adds firmware complexity; vibration switch is noisier | Prefer simple switch for rev A, accelerometer for later refined wake filtering |
| Button set | 6 sealed tactile or panel-style buttons | 6-24 total | Direct and intuitive input | Waterproofing is mechanical work, not just electrical | Make the “Big Red Skip” physically larger and easier to hit blindly |
| Audio feedback | Piezo buzzer + driver transistor if needed | 1-3 | Cheap, simple tones, low design complexity | Limited audio quality | Use short UI chirps only; avoid leaving it powered in sleep |
| Status lighting | 1-3 RGB or mono LEDs | 1-6 | Clear state feedback | Can waste power if overdriven | Use low duty cycle and avoid always-on indicators on battery |
| I/O expansion | MCP23017 / AW9523 / similar GPIO expander | 1.50-4 | Frees MCU pins for display and wake routing | Adds part count and interrupt-handling complexity | Put non-wake buttons and slower controls on expander |
| Wake aggregation | Diodes / OR logic / interrupt combiner | 0.50-3 | Lets several events share a limited wake path | Needs careful polarity planning | Useful when multiple user inputs must wake the system but RTC GPIOs are scarce |
| Battery | Single-cell Li-ion / LiPo, 18650 or flat pack | 5-12 | Easy sourcing, familiar charging ecosystem | Enclosure volume and safety constraints | Use protected cell or protection board if not integrated |
| Charger / PMIC | Li-ion charger + power-path board | 2-8 | Simplifies charging and load sharing | Board selection affects sleep current | Favor low quiescent-current parts and clean load sharing |
| Qi receiver | 5W or 10W Qi receiver module | 5-12 | Enables sealed charging without exposed port | EMI and magnetic placement become critical | Keep Qi coil centered and isolated from NFC zone |
| Magnets / docking ring | Ring magnets or segmented magnets | 4-12 | Enables blind docking and repeatable alignment | Can detune or interfere if badly placed | Keep magnets out of NFC antenna field and away from the center of the Qi coil |
| Gasket material | Silicone cord, foam gasket, or TPU seal | 2-8 | Key to splash resistance | Requires careful compression design | Design compression stops so screws do not over-crush the seal |
| Fasteners / inserts | Heat-set inserts + machine screws | 3-10 | Durable serviceable enclosure | Adds assembly steps | Preferred over repeated self-tapping into plastic for iterative hardware work |

## Estimated subsystem totals

- **Low-risk S3 prototype electronics:** roughly **$75-$170** depending on display, battery, and sealing choices.
- **P4-oriented advanced prototype:** roughly **$90-$210** before enclosure iteration waste and spare modules.

## Selection notes NotebookLM should emphasize

### 1. Power strategy matters more than raw part count

Battery life will be dominated by:

- wake frequency from PIR / bump events,
- idle current of the charger and any always-on sensors,
- backlight power on the primary display,
- whether NFC polling is continuously active.

### 2. The safer architecture is event-driven NFC

Recommended behavior:

1. Device sleeps with wake sources armed.
2. Card insertion switch or proximity wake event brings the MCU up.
3. NFC reader polls only long enough to capture and confirm the tag.
4. Once a tag is read, polling is disabled until the card is removed.

### 3. Display choice changes the whole project

- A fast color UI is desirable for “Now Playing” and “Up Next,” but it is the biggest power and pin-budget pressure.
- The ePaper display is excellent for static context and should not be overloaded with interactive responsibilities.

### 4. Prototype sequencing recommendation

- First prove: wake logic, NFC one-shot behavior, Home Assistant routing, and enclosure ergonomics.
- Then optimize: display bandwidth, richer animation, and aggressive low-power tuning.
