# Hardware Integration and GPIO Strategy for NotebookLM Source Pack

This document gives NotebookLM a practical architecture for solving the pin-budget and wake-source constraints without pretending every signal must land directly on the main MCU.

## Core constraint

The project wants all of the following at once:

- 6 physical buttons
- NFC reader
- SPI ePaper display
- I2C peripherals
- multiple wake sources
- a high-bandwidth primary display path
- deep sleep with low standby current

That combination can exhaust the most convenient GPIO quickly, especially the subset that can participate in wake logic.

## Recommended architectural answer

Do **not** solve this by wiring every human input directly to precious MCU pins.

Instead, split the design into three classes of signals:

### 1. True wake-critical inputs

These deserve direct connection to RTC-capable or otherwise wake-eligible pins:

- card presence switch
- PIR output
- bump / vibration interrupt
- optional shared user-input wake line

### 2. Runtime-only inputs

These can sit behind an I/O expander or resistor ladder once the device is awake:

- left / right / select
- volume up / volume down
- even the Big Red Skip button, if a shared wake strategy is implemented

### 3. High-bandwidth display signals

These should consume the main non-RTC high-speed interface resources and should not compete with wake logic.

## Practical GPIO strategy

### Recommended rev-A strategy

- Put **PIR**, **card presence**, and **bump sensor** on direct wake-capable inputs.
- Route the 6 buttons through either:
  - an **I2C GPIO expander with interrupt**, or
  - a **resistor ladder into one ADC-capable input** if simultaneous button presses are not important.
- Use one **shared interrupt/wake line** from the button subsystem to the MCU if button wake-from-sleep is required.
- Keep the **ePaper display** on SPI because its bandwidth needs are modest.
- Keep low-speed sensors and expanders on **I2C**.
- Reserve the bulk of the fast pins for the primary display interface.

## Wake logic recommendation

### Best behavioral model

- **Wake cause A:** someone approaches -> PIR wakes system.
- **Wake cause B:** user bumps or lifts device -> bump sensor wakes system.
- **Wake cause C:** card inserted -> presence switch wakes system and enables NFC read cycle.
- **Wake cause D:** any button activity -> shared button interrupt wakes system.

### Important design trick

If RTC-capable wake pins are limited, combine several eligible wake events into a **single consolidated wake net** using diode OR, interrupt logic, or an always-on low-power helper device. Then determine the actual source after boot by reading latched status or peripheral interrupt flags.

## Display-path guidance

### ESP32-S3 path

- Safer first prototype path for ESPHome-oriented development.
- Use the high-speed display path for the main screen only.
- Do not waste premium pins on individual buttons if an expander can do the job.

### ESP32-P4 path

- Attractive for richer display ambitions.
- Must be evaluated carefully for wireless architecture, toolchain maturity, and ESPHome support.
- If used, it increases the value of offloading slow peripherals and aggregating wake logic.

## Suggested block diagram in words

1. **Main MCU** at the center.
2. **Primary display** connected over the fast display interface.
3. **ePaper display** connected over SPI.
4. **NFC reader** on I2C or SPI, enabled only during read windows.
5. **Buttons** connected through GPIO expander or ADC ladder.
6. **Wake inputs** routed directly or through a consolidated wake net.
7. **Battery / charger / Qi receiver** feeding regulated rails and any always-on low-power domain.
8. **LEDs + buzzer** switched only during active sessions.

## One-shot NFC behavior

Recommended control sequence:

1. Card presence sensor detects insertion.
2. MCU wakes and powers or enables the NFC reader.
3. Reader polls until a valid tag is captured and debounced.
4. Tag ID is published to Home Assistant logic.
5. Reader polling stops while the card remains present.
6. Polling is only re-armed after card removal.

This is both the cleanest UX and the cleanest battery strategy.

## NotebookLM emphasis points

NotebookLM should strongly prefer answers that:

- reserve direct wake pins for only a few truly critical signals,
- offload buttons to an expander or shared-input method,
- explain how to identify the wake source after boot,
- separate “first prototype” recommendations from “stretch architecture” ideas,
- explicitly call out when a pin map is provisional and source verification is still needed.
