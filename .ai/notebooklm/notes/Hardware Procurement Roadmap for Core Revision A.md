Hardware Procurement Roadmap for Core Revision A
Must-Buy Now (Core Rev A Electronics & Hardware)
ESP32-S3 dev board or module: The safer path for initial bring-up and proving out your mechanics [1, 2].
PN532 NFC reader module: Recommended for your insertion-triggered read window [1, 2].
Card presence switch: A low-profile lever or optical interrupter, which is critical for your one-shot NFC read logic [1-3].
PIR sensor (AM312 or similar): Serves as a low-power, wake-only front end [1-3].
Vibration switch: A cheap, simple bump sensor to wake the device [1, 2].
Displays: A primary 3.4-4.0" TFT LCD module and a secondary 2.13-2.9" SPI ePaper display for static labels under the card slot [1-3].
Button hardware: 5 small sealed buttons (for D-pad and volume) plus a separate, larger sealed button for the "Big Red Skip" [1, 2].
Power components: Single-cell Li-ion/LiPo battery (18650 or flat pack) and a charger/power-path module featuring low quiescent current [2-4].
Docking hardware: 5W or 10W Qi receiver module and alignment magnets (ring or segmented) [2-5].
Enclosure materials: Gasket material (silicone cord, foam, or TPU seal) and fasteners (heat-set inserts and machine screws) for splash resistance and serviceability [2, 3, 5].
Optional for Rev A (Integration Helpers & Minor Feedback)
I/O expander (e.g., MCP23017 / AW9523): Highly recommended to free up premium pins for the displays and wake routing [1, 3].
Interrupt aggregation logic: Diodes or small logic parts to combine multiple inputs into a shared wake net, if GPIO limits are tight [1].
Temporary USB debug/charging access: Breakouts or port parts to assist with development before you fully trust the blind magnetic dock charging [4].
Basic audio and lighting: A simple piezo buzzer for UI chirps and 1-3 RGB/mono LEDs for low-power state feedback [1].
Wiring and lens materials: JST connectors, jumpers, harness parts, and clear inserts/adhesive sheets to protect the display [5].
Filament: An allocation of PETG or ASA for prototype printing, factoring in some waste for failed prints [5].
Defer to Rev B (Upgrades & Stretch Goals)
ESP32-P4 module/dev board: Best deferred until the software toolchain, wireless co-processor strategy, and display drivers are fully proven [2, 6].
Accelerometer module (e.g., LIS3DH): A more advanced motion-sensing upgrade to replace the basic vibration switch once simple wake behaviors are characterized [2, 3, 6].
Premium display path: A higher-end display or touch stack, which introduces significant risk for power consumption and integration complexity [2, 6].
Richer audio hardware: Amplified audio instead of a basic buzzer, as higher fidelity is not essential for the initial functional proof of concept [2, 6].