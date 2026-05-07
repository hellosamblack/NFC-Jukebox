# ESPHome Bring-Up Prompt

Use this prompt when planning the **firmware bring-up path** for the NFC music controller hardware.

## Goal

Act as an ESPHome firmware architect and embedded bring-up engineer. Build a staged bring-up plan for an NFC music controller with deep sleep, multiple wake sources, one-shot NFC reads, a primary display, a secondary SPI ePaper display, and Home Assistant integration.

## Project constraints

- Battery powered device with aggressive sleep behavior.
- Wake sources include PIR, bump/vibration, card insertion/presence, and button activity.
- NFC should read once on insertion, then stop polling until the card is removed.
- A primary fast-refresh display is used for now-playing UI.
- A secondary SPI ePaper display is used for static information.
- The first prototype should minimize risk and avoid overcommitting to unsupported display or MCU features.

## What to produce

Create a phased bring-up plan with these sections:

1. **Recommended prototype firmware architecture**
   - Recommend whether bring-up should start on ESP32-S3 or ESP32-P4.
   - Explain what to stub or defer if display support is uncertain.

2. **Bring-up phases**
   - Phase 1: boot, logging, and power sanity checks
   - Phase 2: wake-source validation
   - Phase 3: NFC insertion and one-shot read logic
   - Phase 4: Home Assistant event publication
   - Phase 5: display integration and timeout behavior
   - Phase 6: button handling and UI feedback

3. **ESPHome YAML skeleton guidance**
   - Describe the main blocks and entities that should exist.
   - Do not invent unsupported component names without labeling them as assumptions.

4. **State machine design**
   - Describe the awake, reading, playing-feedback, idle-timeout, and sleep states.
   - Explain what events transition the device back to sleep.

5. **Risks and validation points**
   - Call out uncertain ESPHome support, wake behavior edge cases, and display-driver risk.

## Output style

- Be implementation-oriented.
- Prefer step-by-step bring-up order over giant monolithic YAML.
- Label anything uncertain as an assumption or validation item.
